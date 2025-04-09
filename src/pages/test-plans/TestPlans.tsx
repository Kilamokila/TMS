import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import {
    useGetTestPlansByProjectQuery,
    useCreateTestPlanMutation,
    useDeleteTestPlanMutation,
    useUpdateTestPlanMutation,
    getErrorMessage,
    useGetProjectByIdQuery,
} from '@services/api/rtkQuery';

import { TestPlanToolbar } from './components/TestPlanToolbar';
import { TestPlansList } from './components/TestPlansList';
import { EmptyState } from './components/EmptyState';
import { EditTestPlanDialog } from './components/EditTestPlanDialog';
import { DeleteTestPlanDialog } from './components/DeleteTestPlanDialog';
import { TestPlanFormData, mapFormToRequest } from './schema';
import { TestPlanResponseDto, mapTestPlanToUI } from '@services/api/models/testPlans';
import { ROUTES } from '@router/routes';

const autoHideTime = 3000;
const userId = 1; // В реальном приложении получаем ID текущего пользователя из системы аутентификации

export const TestPlans: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { projectId } = useSearch({ from: '/' + ROUTES.TEST_PLANS });
    const numericProjectId = projectId ? parseInt(projectId, 10) : undefined;

    // Состояние для поиска
    const [searchValue, setSearchValue] = useState('');
    const [filteredTestPlans, setFilteredTestPlans] = useState<TestPlanResponseDto[]>([]);

    // Состояние для выбора тестовых планов
    const [selectedTestPlans, setSelectedTestPlans] = useState<number[]>([]);

    // Состояние для активного тестового плана (для просмотра, редактирования, удаления)
    const [activeTestPlan, setActiveTestPlan] = useState<TestPlanResponseDto | undefined>(undefined);

    // Состояния для модальных окон
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Состояние для уведомлений
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // RTK Query хуки
    const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(numericProjectId || 0, {
        skip: !numericProjectId,
    });

    const {
        data: testPlans,
        isLoading: isLoadingTestPlans,
        error: testPlansError,
    } = useGetTestPlansByProjectQuery(numericProjectId || 0, {
        skip: !numericProjectId,
    });

    const [createTestPlan, { isLoading: isCreating }] = useCreateTestPlanMutation();
    const [updateTestPlan, { isLoading: isUpdating }] = useUpdateTestPlanMutation();
    const [deleteTestPlan, { isLoading: isDeleting }] = useDeleteTestPlanMutation();

    // Фильтрация тестовых планов по поисковому запросу
    useEffect(() => {
        if (testPlans) {
            if (!searchValue.trim()) {
                setFilteredTestPlans(testPlans);
            } else {
                const search = searchValue.toLowerCase();

                setFilteredTestPlans(
                    testPlans.filter(
                        (testPlan) =>
                            testPlan.name.toLowerCase().includes(search) ||
                            (testPlan.description && testPlan.description.toLowerCase().includes(search)),
                    ),
                );
            }
        } else {
            setFilteredTestPlans([]);
        }
    }, [testPlans, searchValue]);

    // Сброс выбранных тестовых планов при изменении проекта или фильтров
    useEffect(() => {
        setSelectedTestPlans([]);
    }, [projectId, searchValue]);

    // Обработка ошибок RTK Query
    useEffect(() => {
        if (testPlansError) {
            showNotification(getErrorMessage(testPlansError), 'error');
        }
    }, [testPlansError]);

    // Сброс активного тестового плана при закрытии диалогов
    useEffect(() => {
        if (!isEditDialogOpen && !isDeleteDialogOpen) {
            setActiveTestPlan(undefined);
        }
    }, [isEditDialogOpen, isDeleteDialogOpen]);

    // Показать уведомление
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // Обработчики для тестовых планов
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleSelectTestPlan = (id: number, selected: boolean) => {
        setSelectedTestPlans((prev) => {
            if (selected) {
                return [...prev, id];
            } else {
                return prev.filter((testPlanId) => testPlanId !== id);
            }
        });
    };

    const handleSelectAllTestPlans = (selected: boolean) => {
        if (selected) {
            setSelectedTestPlans(filteredTestPlans.map((testPlan) => testPlan.id));
        } else {
            setSelectedTestPlans([]);
        }
    };

    // Обработчики для модальных окон
    const handleOpenCreateDialog = () => {
        setActiveTestPlan(undefined);
        setIsCreateDialogOpen(true);
    };

    const handleOpenViewDialog = (id: number) => {
        if (!numericProjectId) return;

        navigate({
            to: `/${ROUTES.TEST_PLANS}/$testPlanId`,
            params: { testPlanId: String(id) },
            search: { projectId: String(numericProjectId) },
        });
    };

    const handleOpenEditDialog = (id: number) => {
        const testPlan = testPlans?.find((tp) => tp.id === id);

        if (testPlan) {
            setActiveTestPlan(testPlan);
            setIsEditDialogOpen(true);
        }
    };

    const handleOpenDeleteDialog = (id: number) => {
        const testPlan = testPlans?.find((tp) => tp.id === id);

        if (testPlan) {
            setActiveTestPlan(testPlan);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleCreateTestRun = (testPlanId: number) => {
        if (!numericProjectId) return;

        // Перенаправление на страницу создания тестового прогона с предварительно выбранным планом
        navigate({
            to: `/${ROUTES.TEST_RUNS}`,
            search: {
                projectId: String(numericProjectId),
                testPlanId: String(testPlanId),
            },
        });
    };

    // Обработчики для закрытия модальных окон
    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    // CRUD операции для тестовых планов
    const handleCreateTestPlan = async (data: TestPlanFormData) => {
        if (!numericProjectId) return;

        try {
            // Подготовка данных для создания тестового плана
            const testPlanData = mapFormToRequest(data);

            // Создание тестового плана
            await createTestPlan({
                projectId: numericProjectId,
                testPlanData,
            }).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsCreateDialogOpen(false);
            showNotification(t('testPlans.notifications.created'), 'success');
        } catch (error) {
            console.error('Failed to create test plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleUpdateTestPlan = async (data: TestPlanFormData) => {
        if (!activeTestPlan) return;

        try {
            // Подготовка данных для обновления тестового плана
            const testPlanData = mapFormToRequest(data);

            // Обновление тестового плана
            await updateTestPlan({
                testPlanId: activeTestPlan.id,
                testPlanData,
            }).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsEditDialogOpen(false);
            showNotification(t('testPlans.notifications.updated'), 'success');
        } catch (error) {
            console.error('Failed to update test plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleDeleteTestPlan = async () => {
        if (!activeTestPlan) return;

        try {
            // Удаление тестового плана
            await deleteTestPlan(activeTestPlan.id).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsDeleteDialogOpen(false);
            showNotification(t('testPlans.notifications.deleted'), 'success');

            // Убираем удаленный план из выбранных
            setSelectedTestPlans((prev) => prev.filter((id) => id !== activeTestPlan.id));
        } catch (error) {
            console.error('Failed to delete test plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Преобразование в формат для UI
    const testPlansWithStats = filteredTestPlans?.map((plan) => mapTestPlanToUI(plan)) || [];

    // Коды ошибок и состояния загрузки
    const hasError = !!testPlansError;
    const loading = isLoadingProject || isLoadingTestPlans;
    const hasTestPlans = !loading && !hasError && testPlans && testPlans.length > 0;

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            {/* Заголовок страницы */}
            <TestPlanToolbar
                projectId={projectId}
                projectName={project?.name}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onCreateTestPlan={handleOpenCreateDialog}
                selectedTestPlans={selectedTestPlans}
                isLoading={loading}
            />

            {/* Содержимое страницы */}
            {hasTestPlans ? (
                <TestPlansList
                    testPlans={testPlansWithStats}
                    isLoading={loading}
                    selectedTestPlans={selectedTestPlans}
                    onSelectTestPlan={handleSelectTestPlan}
                    onSelectAllTestPlans={handleSelectAllTestPlans}
                    onViewTestPlan={handleOpenViewDialog}
                    onEditTestPlan={handleOpenEditDialog}
                    onDeleteTestPlan={handleOpenDeleteDialog}
                    onCreateTestRun={handleCreateTestRun}
                />
            ) : !loading && !hasError && numericProjectId ? (
                <EmptyState onCreateTestPlan={handleOpenCreateDialog} />
            ) : null}

            {/* Диалоги */}
            <EditTestPlanDialog
                open={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleCreateTestPlan}
                isSubmitting={isCreating}
                userId={userId}
            />

            <EditTestPlanDialog
                open={isEditDialogOpen}
                testPlan={activeTestPlan}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateTestPlan}
                isSubmitting={isUpdating}
                userId={userId}
            />

            <DeleteTestPlanDialog
                open={isDeleteDialogOpen}
                testPlanName={activeTestPlan?.name}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteTestPlan}
            />

            {/* Уведомления */}
            <Snackbar
                open={notification.open}
                autoHideDuration={autoHideTime}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
