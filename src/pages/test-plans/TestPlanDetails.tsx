import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Breadcrumbs,
    Link,
    Alert,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    CircularProgress,
    SelectChangeEvent,
} from '@mui/material';
import { useParams, Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useLanguageContext } from '@context/language/languageContext';
import { LANGUAGE } from '@context/language/types/languageModes';

import {
    useGetTestPlanByIdQuery,
    useUpdateTestPlanMutation,
    useDeleteTestPlanMutation,
    useGetTestPlanTestCasesQuery,
    useGetTestCasesByProjectQuery,
    useAddTestCaseToTestPlanMutation,
    useRemoveTestCaseFromTestPlanMutation,
    useUpdateTestCasesOrderMutation,
    useGetProjectByIdQuery,
    getErrorMessage,
} from '@services/api/rtkQuery';

import { TestCasesList } from './components/TestCasesList';

import { EditTestPlanDialog } from './components/EditTestPlanDialog';
import { DeleteTestPlanDialog } from './components/DeleteTestPlanDialog';
import { TestPlanFormData, mapFormToRequest, TestCaseOrderData } from './schema';
import { TestPlanStatus } from '@services/api/models/testPlans';
import { TestCaseResponseDto } from '@services/api/models/testCase';
import { ROUTES } from '@router/routes';
import { AddTestCasesDialog } from './components/AddTestCaseDialog';
import { ReorderTestCasesDialog } from './components/ReorderTestCaseDialog';

const autoHideTime = 3000;
const userId = 1; // В реальном приложении получаем ID текущего пользователя из системы аутентификации

export const TestPlanDetails: React.FC = () => {
    const { t } = useTranslation();
    const { testPlanId, projectId } = useParams({ strict: false });
    const navigate = useNavigate();
    const { language } = useLanguageContext();

    const numericTestPlanId = parseInt(testPlanId || '0', 10);
    const numericProjectId = projectId ? parseInt(projectId, 10) : 0;

    // Состояния для модальных окон
    const [isAddTestCasesDialogOpen, setIsAddTestCasesDialogOpen] = useState(false);
    const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
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

    // Состояние для комбинированного списка тест-кейсов
    const [testCasesWithOrder, setTestCasesWithOrder] = useState<(TestCaseResponseDto & { orderNumber?: number })[]>(
        [],
    );

    // RTK Query хуки
    const { data: project } = useGetProjectByIdQuery(numericProjectId, {
        skip: !numericProjectId,
    });

    const {
        data: testPlan,
        isLoading: isLoadingTestPlan,
        error: testPlanError,
    } = useGetTestPlanByIdQuery(numericTestPlanId, {
        skip: !numericTestPlanId,
    });

    const {
        data: testPlanTestCases,
        isLoading: isLoadingTestPlanTestCases,
        error: testPlanTestCasesError,
    } = useGetTestPlanTestCasesQuery(numericTestPlanId, {
        skip: !numericTestPlanId,
    });

    const { data: allTestCases, isLoading: isLoadingAllTestCases } = useGetTestCasesByProjectQuery(numericProjectId, {
        skip: !numericProjectId,
    });

    // Мутации
    const [updateTestPlan, { isLoading: isUpdating }] = useUpdateTestPlanMutation();
    const [deleteTestPlan, { isLoading: isDeleting }] = useDeleteTestPlanMutation();
    const [addTestCaseToTestPlan, { isLoading: isAddingTestCases }] = useAddTestCaseToTestPlanMutation();
    const [removeTestCaseFromTestPlan] = useRemoveTestCaseFromTestPlanMutation();
    const [updateTestCasesOrder, { isLoading: isReorderingTestCases }] = useUpdateTestCasesOrderMutation();

    // Форматирование даты с учетом локализации
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const locale = language === LANGUAGE.RU ? ru : enUS;

            return format(date, 'PPpp', { locale });
        } catch (error) {
            console.error(error);

            return dateStr;
        }
    };

    // Обработка ошибок RTK Query
    useEffect(() => {
        if (testPlanError) {
            showNotification(getErrorMessage(testPlanError), 'error');
        }

        if (testPlanTestCasesError) {
            showNotification(getErrorMessage(testPlanTestCasesError), 'error');
        }
    }, [testPlanError, testPlanTestCasesError]);

    // Комбинируем данные тест-кейсов с порядковыми номерами
    useEffect(() => {
        if (allTestCases && testPlanTestCases) {
            const testCasesMap = new Map<number, number>();

            // Создаем карту порядковых номеров
            testPlanTestCases.forEach((tptc) => {
                testCasesMap.set(tptc.testCaseId, tptc.orderNumber);
            });

            // Фильтруем и формируем список тест-кейсов, которые есть в плане
            const testCasesInPlan = allTestCases
                .filter((tc) => testCasesMap.has(tc.id))
                .map((tc) => ({
                    ...tc,
                    orderNumber: testCasesMap.get(tc.id),
                }));

            setTestCasesWithOrder(testCasesInPlan);
        } else {
            setTestCasesWithOrder([]);
        }
    }, [allTestCases, testPlanTestCases]);

    // Показать уведомление
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // Обработчик изменения статуса
    const handleStatusChange = async (event: SelectChangeEvent<TestPlanStatus>) => {
        if (!testPlan) return;

        const newStatus = event.target.value as TestPlanStatus;

        try {
            await updateTestPlan({
                testPlanId: numericTestPlanId,
                testPlanData: {
                    ...testPlan,
                    status: newStatus,
                    createdBy: 1, //TODO: исправить при появлении сущностей;
                },
            }).unwrap();

            showNotification(t('testPlans.notifications.updated'), 'success');
        } catch (error) {
            console.error('Failed to update test plan status:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Обработчик для добавления тест-кейсов
    const handleAddTestCases = async (selectedTestCaseIds: number[]) => {
        if (!numericTestPlanId || selectedTestCaseIds.length === 0) return;

        try {
            // Добавляем каждый тест-кейс по очереди
            for (const testCaseId of selectedTestCaseIds) {
                await addTestCaseToTestPlan({
                    testPlanId: numericTestPlanId,
                    testCaseId,
                }).unwrap();
            }

            setIsAddTestCasesDialogOpen(false);
            showNotification(t('testPlans.notifications.testCasesAdded'), 'success');
        } catch (error) {
            console.error('Failed to add test cases to plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Обработчик для изменения порядка тест-кейсов
    const handleReorderTestCases = async (orderedTestCases: TestCaseOrderData[]) => {
        if (!numericTestPlanId || orderedTestCases.length === 0) return;

        try {
            await updateTestCasesOrder({
                testPlanId: numericTestPlanId,
                testCases: orderedTestCases,
            }).unwrap();

            setIsReorderDialogOpen(false);
            showNotification(t('testPlans.notifications.testCasesReordered'), 'success');
        } catch (error) {
            console.error('Failed to reorder test cases:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Обработчик для удаления тест-кейса из плана
    const handleRemoveTestCase = async (testCaseId: number) => {
        if (!numericTestPlanId) return;

        try {
            await removeTestCaseFromTestPlan({
                testPlanId: numericTestPlanId,
                testCaseId,
            }).unwrap();

            showNotification(t('testPlans.notifications.testCaseRemoved'), 'success');
        } catch (error) {
            console.error('Failed to remove test case from plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Обработчик для просмотра тест-кейса
    const handleViewTestCase = (testCaseId: number) => {
        // Тут обычно был бы переход на страницу просмотра тест-кейса,
        // но в данной реализации просто показываем уведомление
        showNotification(`Test case ID: ${testCaseId}`, 'info');
    };

    // Обработчики для редактирования тестового плана
    const handleOpenEditDialog = () => {
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    const handleUpdateTestPlan = async (data: TestPlanFormData) => {
        if (!testPlan) return;

        try {
            // Подготовка данных для обновления тестового плана
            const testPlanData = mapFormToRequest(data);

            // Обновление тестового плана
            await updateTestPlan({
                testPlanId: testPlan.id,
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

    // Обработчики для удаления тестового плана
    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteTestPlan = async () => {
        if (!testPlan) return;

        try {
            // Удаление тестового плана
            await deleteTestPlan(testPlan.id).unwrap();

            // Закрываем диалог и отображаем уведомление об успехе
            setIsDeleteDialogOpen(false);
            showNotification(t('testPlans.notifications.deleted'), 'success');

            // Переход на страницу списка планов
            navigate({ to: `/${ROUTES.TEST_PLANS}/${projectId}` });
        } catch (error) {
            console.error('Failed to delete test plan:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Получение цвета для статуса
    const getStatusColor = (status: TestPlanStatus) => {
        switch (status) {
            case TestPlanStatus.ACTIVE:
                return 'success';
            case TestPlanStatus.DRAFT:
                return 'warning';
            case TestPlanStatus.COMPLETED:
                return 'info';
            default:
                return 'default';
        }
    };

    // Если идет загрузка данных
    if (isLoadingTestPlan) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Если тестовый план не найден
    if (!testPlan) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{t('common.loading')}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Хлебные крошки и заголовок */}
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link component={RouterLink} to={`/${ROUTES.TEST_PLANS}/${projectId}`} color="inherit">
                        {t('projects.title')}
                    </Link>
                    {project && (
                        <Link component={RouterLink} to={`/${ROUTES.PROJECT}/${numericProjectId}`} color="inherit">
                            {project.name}
                        </Link>
                    )}
                    <Link component={RouterLink} to={`/${ROUTES.TEST_PLANS}`} color="inherit">
                        {t('testPlans.title')}
                    </Link>
                    <Typography color="text.primary">{testPlan.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        component={RouterLink}
                        to={`/${ROUTES.TEST_PLANS}`}
                        sx={{ mr: 1 }}
                        aria-label={t('testPlans.details.backToList')}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1">
                        {testPlan.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                        <IconButton onClick={handleOpenEditDialog} aria-label={t('common.edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenDeleteDialog} color="error" aria-label={t('common.delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Информация о тестовом плане */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ minWidth: 200 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {t('testPlans.form.status')}
                            </Typography>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <Select
                                    value={testPlan.status}
                                    onChange={handleStatusChange}
                                    disabled={isUpdating}
                                    renderValue={(selected) => (
                                        <Chip
                                            label={t(`testPlans.status.${selected.toLowerCase()}`)}
                                            color={getStatusColor(selected as TestPlanStatus)}
                                            size="small"
                                        />
                                    )}
                                >
                                    <MenuItem value={TestPlanStatus.DRAFT}>{t('testPlans.status.draft')}</MenuItem>
                                    <MenuItem value={TestPlanStatus.ACTIVE}>{t('testPlans.status.active')}</MenuItem>
                                    <MenuItem value={TestPlanStatus.COMPLETED}>
                                        {t('testPlans.status.completed')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ minWidth: 200 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {t('testPlans.columns.testCases')}
                            </Typography>
                            <Typography variant="body1">{testCasesWithOrder.length}</Typography>
                        </Box>

                        <Box sx={{ minWidth: 200 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {t('testPlans.columns.lastUpdated')}
                            </Typography>
                            <Typography variant="body1">{formatDate(testPlan.updatedAt)}</Typography>
                        </Box>
                    </Box>

                    {testPlan.description && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {t('testPlans.form.description')}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {testPlan.description}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Список тест-кейсов */}
            <TestCasesList
                testCases={testCasesWithOrder}
                isLoading={isLoadingTestPlanTestCases || isLoadingAllTestCases}
                onAddTestCases={() => setIsAddTestCasesDialogOpen(true)}
                onReorderTestCases={() => setIsReorderDialogOpen(true)}
                onRemoveTestCase={handleRemoveTestCase}
                onViewTestCase={handleViewTestCase}
            />

            {/* Диалоги */}
            <AddTestCasesDialog
                open={isAddTestCasesDialogOpen}
                onClose={() => setIsAddTestCasesDialogOpen(false)}
                onSubmit={handleAddTestCases}
                isSubmitting={isAddingTestCases}
                availableTestCases={allTestCases || []}
                existingTestCaseIds={testCasesWithOrder.map((tc) => tc.id)}
                isLoading={isLoadingAllTestCases}
            />

            <ReorderTestCasesDialog
                open={isReorderDialogOpen}
                onClose={() => setIsReorderDialogOpen(false)}
                onSubmit={handleReorderTestCases}
                isSubmitting={isReorderingTestCases}
                testCases={testCasesWithOrder}
            />

            <EditTestPlanDialog
                open={isEditDialogOpen}
                testPlan={testPlan}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateTestPlan}
                isSubmitting={isUpdating}
                userId={userId}
            />

            <DeleteTestPlanDialog
                open={isDeleteDialogOpen}
                testPlanName={testPlan.name}
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
