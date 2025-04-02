import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { TestRunsTable } from './components/TestRunsTable';
import { NewTestRunModal } from './components/NewTestRunModal';
import { TestRunFormData } from './components/NewTestRunModal';
import { EditTestRunData } from './components/EditTestRunModal';
import { MOCK_TEST_RUNS } from './model/testRun';
import { TestRun } from './model/testRun';

export const TestRuns: React.FC = () => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [isNewTestRunModalOpen, setIsNewTestRunModalOpen] = useState(false);

    // Состояние для списка тестовых прогонов и уведомлений
    const [testRuns, setTestRuns] = useState<TestRun[]>(MOCK_TEST_RUNS);
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleStartNewTestRun = () => {
        setIsNewTestRunModalOpen(true);
    };

    const handleCloseNewTestRunModal = () => {
        setIsNewTestRunModalOpen(false);
    };

    const handleCreateTestRun = (data: TestRunFormData) => {
        // Здесь была бы логика для сохранения нового тестового прогона через API
        // Сейчас просто добавляем в состояние с моковыми данными
        const newTestRun: TestRun = {
            id: `${Date.now()}`, // Генерируем уникальный ID
            title: data.title,
            description: data.description,
            status: 'inProgress',
            author: {
                id: '1',
                name: 'Roman 777',
            },
            environment: data.environment || 'Not specified',
            totalTime: 0,
            elapsedTime: 0,
            startedAt: new Date().toISOString(),
            stats: {
                total: 0,
                passed: 0,
                failed: 0,
                blocked: 0,
                skipped: 0,
                invalid: 0,
            },
        };

        setTestRuns((prev) => [newTestRun, ...prev]);
        setIsNewTestRunModalOpen(false);

        // Показываем уведомление
        setNotification({
            open: true,
            message: t('testRuns.notifications.created'),
            severity: 'success',
        });
    };

    const handleEditTestRun = (testRun: TestRun, data: EditTestRunData) => {
        // Обновляем тестовый прогон
        setTestRuns((prev) =>
            prev.map((run) =>
                run.id === testRun.id
                    ? {
                          ...run,
                          title: data.title,
                          description: data.description || run.description,
                          environment: data.environment,
                          status: data.status,
                      }
                    : run,
            ),
        );

        // Показываем уведомление
        setNotification({
            open: true,
            message: t('testRuns.notifications.updated'),
            severity: 'success',
        });
    };

    const handleDeleteTestRun = (testRun: TestRun) => {
        // Удаляем тестовый прогон
        setTestRuns((prev) => prev.filter((run) => run.id !== testRun.id));

        // Показываем уведомление
        setNotification({
            open: true,
            message: t('testRuns.notifications.deleted'),
            severity: 'success',
        });
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

            <TestRunsTable
                testRuns={testRuns}
                onEditTestRun={handleEditTestRun}
                onDeleteTestRun={handleDeleteTestRun}
            />

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
