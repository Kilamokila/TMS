import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { TestRunsTable } from './components/TestRunsTable';
import { NewTestRunModal } from './components/NewTestRunModal';
import { useCreateTestRunMutation, getErrorMessage, useGetTestRunsByTestPlanQuery } from '@services/api/rtkQuery';
import { TestRunFormData } from './components/NewTestRunModal';
import { TestRunResponseDto, TestRunRequestDto, mapTestRunStatusToUiStatus } from '@services/api/models/testRun';
import { TestRun, TestRunStatus } from './model/testRun';

export const TestRuns: React.FC = () => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [isNewTestRunModalOpen, setIsNewTestRunModalOpen] = useState(false);
    const [filteredTestRuns, setFilteredTestRuns] = useState<TestRun[]>([]);

    // RTK Query хуки
    // const { data: apiTestRuns, isLoading, error: fetchError } = useGetAllTestRunsQuery();

    const { data: apiTestRuns, isLoading, error: fetchError } = useGetTestRunsByTestPlanQuery(8);

    const [createTestRun] = useCreateTestRunMutation();

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

    // Преобразование данных API в формат, используемый компонентами
    useEffect(() => {
        if (apiTestRuns) {
            const transformed = apiTestRuns.map((apiRun: TestRunResponseDto) => {
                // Подсчет статистики тестов
                const stats = {
                    total: apiRun.testRunResults.length,
                    passed: apiRun.testRunResults.filter((r) => r.status === 'PASSED').length,
                    failed: apiRun.testRunResults.filter((r) => r.status === 'FAILED').length,
                    blocked: apiRun.testRunResults.filter((r) => r.status === 'BLOCKED').length,
                    skipped: apiRun.testRunResults.filter((r) => r.status === 'SKIPPED').length,
                    invalid: 0, // API не возвращает этот статус, но он используется в UI
                };

                // Преобразуем статус API в статус для UI
                const uiStatus = mapTestRunStatusToUiStatus(apiRun.status) as TestRunStatus;

                return {
                    id: apiRun.id.toString(),
                    title: apiRun.name,
                    description: '', // API не возвращает описание
                    status: uiStatus,
                    author: {
                        id: apiRun.createdBy.toString(),
                        name: `User ${apiRun.createdBy}`, // Имя пользователя нужно получать отдельно
                    },
                    environment: 'Рабочая среда', // API не возвращает окружение
                    totalTime: 0, // API не возвращает время
                    elapsedTime: 0, // API не возвращает время
                    startDate: apiRun.startDate || new Date().toISOString(),
                    endDate: apiRun.endDate,
                    startedAt: apiRun.startDate || new Date().toISOString(),
                    stats,
                };
            }) as TestRun[];

            // Фильтрация по поиску
            if (searchValue) {
                const lowerCaseSearch = searchValue.toLowerCase();

                setFilteredTestRuns(
                    transformed.filter(
                        (run) =>
                            run.title.toLowerCase().includes(lowerCaseSearch) ||
                            (run.description && run.description.toLowerCase().includes(lowerCaseSearch)),
                    ),
                );
            } else {
                setFilteredTestRuns(transformed);
            }
        }
    }, [apiTestRuns, searchValue]);

    // Обработка ошибок
    useEffect(() => {
        if (fetchError) {
            showNotification(getErrorMessage(fetchError), 'error');
        }
    }, [fetchError]);

    // Функция для отображения уведомлений
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleStartNewTestRun = () => {
        setIsNewTestRunModalOpen(true);
    };

    const handleCloseNewTestRunModal = () => {
        setIsNewTestRunModalOpen(false);
    };

    const handleCreateTestRun = async (data: TestRunFormData) => {
        try {
            // Преобразование данных формы в запрос API
            const testRunData: TestRunRequestDto = {
                testPlanId: 4, // Пример ID тестового плана (должен быть настроен соответствующим образом)
                name: data.title,
                createdBy: 1, // ID текущего пользователя (должен быть получен из контекста аутентификации)
                assignedToUserId: data.defaultAssignee ? parseInt(data.defaultAssignee) : undefined,
            };

            // Создание тестового запуска через API
            const response = await createTestRun(testRunData).unwrap();

            console.log('Создан новый тестовый запуск:', response);

            setIsNewTestRunModalOpen(false);
            showNotification(t('testRuns.notifications.created'), 'success');
        } catch (error) {
            console.error('Ошибка при создании тестового запуска:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleAddFilter = () => {
        // Логика для добавления фильтра
        console.log('Add filter clicked');
    };

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('testRuns.title')}
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleStartNewTestRun}>
                    {t('testRuns.startNewTestRun')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <TextField
                    placeholder={t('testRuns.searchPlaceholder')}
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="outlined" color="primary" onClick={handleAddFilter}>
                    {t('testRuns.addFilter')}
                </Button>
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TestRunsTable testRuns={filteredTestRuns} />
            )}

            <NewTestRunModal
                open={isNewTestRunModalOpen}
                onClose={handleCloseNewTestRunModal}
                onSubmit={handleCreateTestRun}
            />

            {/* Уведомления */}
            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
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
