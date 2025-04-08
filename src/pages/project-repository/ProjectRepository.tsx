import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
//import { debounce } from 'lodash-es';

import {
    useGetProjectByIdQuery,
    useGetTestCasesByProjectQuery,
    useCreateTestCaseMutation,
    useDeleteTestCaseMutation,
    useUpdateTestCaseMutation,
    getErrorMessage,
    useDeleteTestStepMutation,
    useUpdateTestStepMutation,
    useCreateTestStepMutation,
} from '@services/api/rtkQuery';

import { ProjectHeader } from './components/ProjectHeader';
import { EmptyState } from './components/EmptyState';
import { TestCaseList } from './components/TestCaseList';
import { ViewTestCaseDialog } from './components/ViewTestCaseDialog';
import { DeleteTestCaseDialog } from './components/DeleteTestCaseDialog';
import { TestCaseFormData, mapFormToTestCaseRequest, mapFormToTestStepRequests } from './schema';
import { TestCaseRequestDto, TestCaseResponseDto, TestStepRequestDto } from '@services/api/models';
import { CreateEditTestCaseDialog } from './components/CreateEditTestCaseDialog';

//const debounceTime = 500;
const autoHideTime = 3000;
const userId = 1; // В реальном приложении получаем ID текущего пользователя из системы аутентификации

export const ProjectRepository: React.FC = () => {
    const { t } = useTranslation();
    const { projectId } = useParams({ strict: false });
    const numericProjectId = parseInt(projectId || '0', 10);

    // Состояние для поиска
    const [searchValue, setSearchValue] = useState('');
    const [filteredTestCases, setFilteredTestCases] = useState<TestCaseResponseDto[]>([]);

    // Состояние для выбора тестовых сценариев
    const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);

    // Состояние для активного тестового сценария (для просмотра, редактирования, удаления)
    const [activeTestCase, setActiveTestCase] = useState<TestCaseResponseDto | undefined>(undefined);

    // Состояния для модальных окон
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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
    const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(numericProjectId, {
        skip: !numericProjectId,
    });

    const {
        data: testCases,
        isLoading: isLoadingTestCases,
        error: testCasesError,
    } = useGetTestCasesByProjectQuery(numericProjectId, { skip: !numericProjectId });

    const [createTestCase, { isLoading: isCreating }] = useCreateTestCaseMutation();
    const [updateTestCase, { isLoading: isUpdating }] = useUpdateTestCaseMutation();
    const [deleteTestCase, { isLoading: isDeleting }] = useDeleteTestCaseMutation();
    const [deleteTestStep] = useDeleteTestStepMutation();
    const [updateTestStep] = useUpdateTestStepMutation();
    const [createTestStep] = useCreateTestStepMutation();

    // Фильтрация тестовых сценариев по поисковому запросу
    useEffect(() => {
        if (testCases) {
            if (!searchValue.trim()) {
                setFilteredTestCases(testCases);
            } else {
                const search = searchValue.toLowerCase();

                setFilteredTestCases(
                    testCases.filter(
                        (testCase) =>
                            testCase.title.toLowerCase().includes(search) ||
                            (testCase.description && testCase.description.toLowerCase().includes(search)),
                    ),
                );
            }
        }
    }, [testCases, searchValue]);

    // Сброс выбранных тестовых сценариев при изменении проекта или фильтров
    useEffect(() => {
        setSelectedTestCases([]);
    }, [projectId, searchValue]);

    // Обработка ошибок RTK Query
    useEffect(() => {
        if (testCasesError) {
            showNotification(getErrorMessage(testCasesError), 'error');
        }
    }, [testCasesError]);

    // Сброс активного тестового сценария при закрытии диалогов
    useEffect(() => {
        if (!isViewDialogOpen && !isEditDialogOpen && !isDeleteDialogOpen) {
            setActiveTestCase(undefined);
        }
    }, [isViewDialogOpen, isEditDialogOpen, isDeleteDialogOpen]);

    // Показать уведомление
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // TODO: если поиск реализует бэк - сдлеать обработчик для поиска с debounce

    // const debouncedSearch = useCallback(
    //     debounce((value: string) => {
    //         setSearchValue(value);
    //     }, debounceTime),
    //     [],
    // );

    // Обработчики для тестовых сценариев
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const handleSelectTestCase = (id: number, selected: boolean) => {
        setSelectedTestCases((prev) => {
            if (selected) {
                return [...prev, id];
            } else {
                return prev.filter((testCaseId) => testCaseId !== id);
            }
        });
    };

    const handleSelectAllTestCases = (selected: boolean) => {
        if (selected) {
            setSelectedTestCases(filteredTestCases.map((testCase) => testCase.id));
        } else {
            setSelectedTestCases([]);
        }
    };

    // Обработчики для модальных окон
    const handleOpenCreateDialog = () => {
        setActiveTestCase(undefined);
        setIsCreateDialogOpen(true);
    };

    const handleOpenViewDialog = (id: number) => {
        const testCase = testCases?.find((tc) => tc.id === id);

        if (testCase) {
            setActiveTestCase(testCase);
            setIsViewDialogOpen(true);
        }
    };

    const handleOpenEditDialog = (id: number) => {
        const testCase = testCases?.find((tc) => tc.id === id);

        if (testCase) {
            setActiveTestCase(testCase);
            setIsEditDialogOpen(true);
        }
    };

    const handleOpenDeleteDialog = (id: number) => {
        const testCase = testCases?.find((tc) => tc.id === id);

        if (testCase) {
            setActiveTestCase(testCase);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    // CRUD операции для тестовых сценариев
    const handleCreateTestCase = async (data: TestCaseFormData): Promise<void> => {
        try {
            // Подготовка данных для создания тестового сценария
            const testCaseData = mapFormToTestCaseRequest(data, userId);
            const testSteps = mapFormToTestStepRequests(data.testSteps);

            // Создание тестового сценария
            await createTestCase({
                projectId: numericProjectId,
                testCaseData,
                testSteps,
            }).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsCreateDialogOpen(false);
            showNotification(t('testCases.notifications.created'), 'success');

            // Не возвращаем результат (void)
        } catch (error) {
            console.error('Failed to create test case:', error);
            showNotification(getErrorMessage(error), 'error');
            throw error;
        }
    };

    const handleUpdateTestCase = async (data: TestCaseFormData) => {
        if (!activeTestCase) return;

        try {
            // Обновление данных тестового сценария
            const testCaseData: TestCaseRequestDto = {
                title: data.title,
                description: data.description,
                preConditions: data.preConditions,
                postConditions: data.postConditions,
                testCasePriority: data.testCasePriority,
                testCaseStatus: data.testCaseStatus,
                createdBy: activeTestCase.createdBy, // Сохраняем оригинального создателя
                updatedBy: userId,
            };

            await updateTestCase({
                testCaseId: activeTestCase.id,
                testCaseData,
            }).unwrap();

            // Сравнение текущих и новых шагов
            const existingSteps = activeTestCase.testSteps; // TestStepResponseDto[]
            const newSteps = data.testSteps; // Из формы, с опциональным id

            // Удаление шагов, которых больше нет
            const stepsToRemove = existingSteps.filter(
                (existingStep) => !newSteps.some((newStep) => newStep.id === existingStep.id),
            );

            for (const stepToRemove of stepsToRemove) {
                await deleteTestStep({
                    testStepId: stepToRemove.id,
                    testCaseId: activeTestCase.id,
                }).unwrap();
            }

            // Создание новых и обновление существующих шагов
            for (const newStep of newSteps) {
                const stepData: TestStepRequestDto = {
                    orderNumber: newStep.orderNumber,
                    action: newStep.action,
                    expectedResult: newStep.expectedResult,
                };

                // Проверка на наличие id (для различения новых и существующих шагов)
                if (newStep.id === undefined) {
                    // Новый шаг
                    await createTestStep({
                        testCaseId: activeTestCase.id,
                        testStepData: stepData,
                    }).unwrap();
                } else {
                    // Проверяем, изменились ли данные шага
                    const existingStep = existingSteps.find((step) => step.id === newStep.id);

                    if (
                        existingStep &&
                        (existingStep.orderNumber !== newStep.orderNumber ||
                            existingStep.action !== newStep.action ||
                            existingStep.expectedResult !== newStep.expectedResult)
                    ) {
                        // Обновление существующего шага
                        await updateTestStep({
                            testStepId: newStep.id,
                            testStepData: stepData,
                            testCaseId: activeTestCase.id,
                        }).unwrap();
                    }
                }
            }

            setIsEditDialogOpen(false);
            showNotification(t('testCases.notifications.updated'), 'success');
        } catch (error) {
            console.error('Failed to update test case:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleDeleteTestCase = async () => {
        if (!activeTestCase) return;

        try {
            // Удаление тестового сценария
            await deleteTestCase(activeTestCase.id).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsDeleteDialogOpen(false);
            showNotification(t('testCases.notifications.deleted'), 'success');

            // Убираем удаленный сценарий из выбранных
            setSelectedTestCases((prev) => prev.filter((id) => id !== activeTestCase.id));
        } catch (error) {
            console.error('Failed to delete test case:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // const handleDeleteTestStep = async (testStepId: number, testCaseId: number) => {
    //     try {
    //         // console.log({ testStepId, testCaseId });
    //         await deleteTestStep({ testStepId, testCaseId }).unwrap();
    //     } catch (error) {
    //         console.error('Failed to delete test step:', error);
    //         showNotification(getErrorMessage(error), 'error');
    //     }
    // };

    // Переход от просмотра к редактированию
    const handleViewToEdit = () => {
        setIsViewDialogOpen(false);
        setIsEditDialogOpen(true);
    };

    // Переход от просмотра к удалению
    const handleViewToDelete = () => {
        setIsViewDialogOpen(false);
        setIsDeleteDialogOpen(true);
    };

    // Коды ошибок
    const hasError = !!testCasesError;
    const loading = isLoadingProject || isLoadingTestCases;
    const hasTestCases = !loading && !hasError && testCases && testCases.length > 0;
    const projectCode = project?.code || '';

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            {/* Заголовок страницы */}
            <ProjectHeader
                projectCode={projectCode}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onCreateTestCase={handleOpenCreateDialog}
                selectedTestCases={selectedTestCases}
                isLoading={loading}
            />

            {/* Содержимое страницы */}
            {hasTestCases ? (
                <TestCaseList
                    testCases={filteredTestCases}
                    isLoading={loading}
                    selectedTestCases={selectedTestCases}
                    onSelectTestCase={handleSelectTestCase}
                    onSelectAllTestCases={handleSelectAllTestCases}
                    onViewTestCase={handleOpenViewDialog}
                    onEditTestCase={handleOpenEditDialog}
                    onDeleteTestCase={handleOpenDeleteDialog}
                />
            ) : !loading && !hasError ? (
                <EmptyState onCreateTestCase={handleOpenCreateDialog} />
            ) : null}

            {/* Диалоги */}
            <CreateEditTestCaseDialog
                open={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handleCreateTestCase}
                isSubmitting={isCreating}
            />

            <CreateEditTestCaseDialog
                open={isEditDialogOpen}
                testCase={activeTestCase}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateTestCase}
                isSubmitting={isUpdating}
            />

            <ViewTestCaseDialog
                open={isViewDialogOpen}
                testCase={activeTestCase}
                onClose={handleCloseViewDialog}
                onEdit={handleViewToEdit}
                onDelete={handleViewToDelete}
            />

            <DeleteTestCaseDialog
                open={isDeleteDialogOpen}
                testCaseTitle={activeTestCase?.title}
                isDeleting={isDeleting}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteTestCase}
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
