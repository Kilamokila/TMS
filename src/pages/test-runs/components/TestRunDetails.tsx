import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Select,
    MenuItem,
    TextField,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
    useGetTestRunByIdQuery,
    useUpdateTestCaseResultMutation,
    useCompleteTestRunMutation,
    getErrorMessage,
} from '@services/api/rtkQuery';
import { TestRunResultUpdateRequestDto, TestRunResultStatus } from '@services/api/models/testRun';
import { TestRunStatsBar } from './TestRunStatsBar';

interface TestRunDetailsProps {
    testRunId: number;
    onBack: () => void;
}

export const TestRunDetails: React.FC<TestRunDetailsProps> = ({ testRunId, onBack }) => {
    const { t } = useTranslation();
    const { data: testRun, isLoading, error } = useGetTestRunByIdQuery(testRunId);
    const [updateResult, { isLoading: isUpdating }] = useUpdateTestCaseResultMutation();
    const [completeTestRun, { isLoading: isCompleting }] = useCompleteTestRunMutation();

    const [selectedStatus, setSelectedStatus] = useState<TestRunResultStatus>('PASSED');
    const [notes, setNotes] = useState<string>('');
    const [updatingTestCaseId, setUpdatingTestCaseId] = useState<number | null>(null);

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value as TestRunResultStatus);
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(event.target.value);
    };

    const handleUpdateResult = async (testCaseId: number) => {
        if (!testRun) return;

        setUpdatingTestCaseId(testCaseId);

        try {
            const updateData: TestRunResultUpdateRequestDto = {
                status: selectedStatus,
                notes: notes || undefined,
            };

            await updateResult({
                testCaseId,
                testRunId,
                data: updateData,
            }).unwrap();

            // Сбросить поля формы
            setNotes('');
        } catch (error) {
            console.error('Ошибка при обновлении результата:', error);
        } finally {
            setUpdatingTestCaseId(null);
        }
    };

    const handleCompleteTestRun = async () => {
        if (!testRun) return;

        try {
            await completeTestRun(testRunId).unwrap();
        } catch (error) {
            console.error('Ошибка при завершении тестового запуска:', error);
        }
    };

    // Форматирование даты для отображения
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Получение цвета статуса результата
    const getStatusColor = (status: TestRunResultStatus) => {
        switch (status) {
            case 'PASSED':
                return 'success';
            case 'FAILED':
                return 'error';
            case 'BLOCKED':
                return 'warning';
            case 'SKIPPED':
                return 'default';
            default:
                return 'default';
        }
    };

    // Получение человекочитаемого статуса
    const getReadableStatus = (status: string) => {
        return t(`testRuns.status.${status.toLowerCase()}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
                    {t('common.back')}
                </Button>
                <Typography color="error">{getErrorMessage(error)}</Typography>
            </Box>
        );
    }

    if (!testRun) {
        return (
            <Box sx={{ p: 3 }}>
                <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
                    {t('common.back')}
                </Button>
                <Typography>{t('testRuns.notFound')}</Typography>
            </Box>
        );
    }

    // Подсчет статистики результатов
    const stats = {
        total: testRun.testRunResults.length,
        passed: testRun.testRunResults.filter((r) => r.status === 'PASSED').length,
        failed: testRun.testRunResults.filter((r) => r.status === 'FAILED').length,
        blocked: testRun.testRunResults.filter((r) => r.status === 'BLOCKED').length,
        skipped: testRun.testRunResults.filter((r) => r.status === 'SKIPPED').length,
        invalid: 0, // API не возвращает этот статус
    };

    const isCompleted = testRun.status === 'COMPLETED';

    return (
        <Box sx={{ p: 3 }}>
            <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
                {t('common.back')}
            </Button>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {testRun.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
                    <Chip
                        label={getReadableStatus(testRun.status)}
                        color={isCompleted ? 'success' : 'primary'}
                        variant="filled"
                    />
                    <Typography variant="body2">
                        {t('testRuns.createdBy')}: {testRun.createdBy}
                    </Typography>
                    <Typography variant="body2">
                        {t('testRuns.startDate')}: {formatDate(testRun.startDate)}
                    </Typography>
                    {testRun.endDate && (
                        <Typography variant="body2">
                            {t('testRuns.endDate')}: {formatDate(testRun.endDate)}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {t('testRuns.statistics')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <TestRunStatsBar stats={stats} />
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                            {stats.total} {t('testRuns.totalTests')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                            label={`${t('testRuns.status.passed')}: ${stats.passed}`}
                            color="success"
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            label={`${t('testRuns.status.failed')}: ${stats.failed}`}
                            color="error"
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            label={`${t('testRuns.status.blocked')}: ${stats.blocked}`}
                            color="warning"
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            label={`${t('testRuns.status.skipped')}: ${stats.skipped}`}
                            color="default"
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>

                {!isCompleted && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCompleteTestRun}
                        disabled={isCompleting}
                        startIcon={isCompleting ? <CircularProgress size={20} /> : undefined}
                    >
                        {isCompleting ? t('common.processing') : t('testRuns.completeRun')}
                    </Button>
                )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
                {t('testRuns.testResults')}
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('testRuns.testCase')}</TableCell>
                            <TableCell>{t('testRuns.status')}</TableCell>
                            <TableCell>{t('testRuns.notes')}</TableCell>
                            <TableCell>{t('testRuns.executedAt')}</TableCell>
                            {!isCompleted && <TableCell>{t('testRuns.actions')}</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testRun.testRunResults.map((result) => (
                            <TableRow key={`${result.testRunId}-${result.testCaseId}`}>
                                <TableCell>{result.testCaseId}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getReadableStatus(result.status)}
                                        color={getStatusColor(result.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{result.notes || '-'}</TableCell>
                                <TableCell>{formatDate(result.executedAt)}</TableCell>
                                {!isCompleted && (
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <FormControl size="small" sx={{ width: 120 }}>
                                                <InputLabel id={`status-label-${result.testCaseId}`}>
                                                    {t('testRuns.status')}
                                                </InputLabel>
                                                <Select
                                                    labelId={`status-label-${result.testCaseId}`}
                                                    value={selectedStatus}
                                                    onChange={handleStatusChange}
                                                    label={t('testRuns.status')}
                                                    disabled={isUpdating && updatingTestCaseId === result.testCaseId}
                                                >
                                                    <MenuItem value="PASSED">{t('testRuns.status.passed')}</MenuItem>
                                                    <MenuItem value="FAILED">{t('testRuns.status.failed')}</MenuItem>
                                                    <MenuItem value="BLOCKED">{t('testRuns.status.blocked')}</MenuItem>
                                                    <MenuItem value="SKIPPED">{t('testRuns.status.skipped')}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                size="small"
                                                placeholder={t('testRuns.addNotes')}
                                                value={notes}
                                                onChange={handleNotesChange}
                                                disabled={isUpdating && updatingTestCaseId === result.testCaseId}
                                                sx={{ width: 200 }}
                                            />
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleUpdateResult(result.testCaseId)}
                                                disabled={isUpdating && updatingTestCaseId === result.testCaseId}
                                                startIcon={
                                                    isUpdating && updatingTestCaseId === result.testCaseId ? (
                                                        <CircularProgress size={16} />
                                                    ) : undefined
                                                }
                                            >
                                                {isUpdating && updatingTestCaseId === result.testCaseId
                                                    ? t('common.updating')
                                                    : t('common.update')}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {testRun.testRunResults.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={isCompleted ? 4 : 5} align="center">
                                    <Typography variant="body2" sx={{ py: 2 }}>
                                        {t('testRuns.noResults')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
