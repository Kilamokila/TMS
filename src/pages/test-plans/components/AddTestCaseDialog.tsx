import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    Chip,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { TestCaseResponseDto } from '@services/api/models/testCase';

interface AddTestCasesDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (selectedTestCaseIds: number[]) => Promise<void>;
    isSubmitting: boolean;
    availableTestCases: TestCaseResponseDto[];
    existingTestCaseIds: number[];
    isLoading: boolean;
}

export const AddTestCasesDialog: React.FC<AddTestCasesDialogProps> = ({
    open,
    onClose,
    onSubmit,
    isSubmitting,
    availableTestCases,
    existingTestCaseIds,
    isLoading,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // Состояние для фильтрации и выбора тест-кейсов
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filteredTestCases, setFilteredTestCases] = useState<TestCaseResponseDto[]>([]);

    // Функция для фильтрации тест-кейсов по поисковому запросу
    const filterTestCases = (query: string) => {
        if (!availableTestCases) return [];

        // Исключаем уже добавленные тест-кейсы
        const unusedTestCases = availableTestCases.filter((tc) => !existingTestCaseIds.includes(tc.id));

        if (!query) return unusedTestCases;

        const lowerQuery = query.toLowerCase();

        return unusedTestCases.filter(
            (tc) =>
                tc.title.toLowerCase().includes(lowerQuery) ||
                (tc.description && tc.description.toLowerCase().includes(lowerQuery)),
        );
    };

    // Обновляем фильтрованные тест-кейсы при изменении запроса или списка доступных тест-кейсов
    useEffect(() => {
        setFilteredTestCases(filterTestCases(searchQuery));
    }, [searchQuery, availableTestCases, existingTestCaseIds]);

    // Обработчик изменения поиска
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Обработчики выбора тест-кейсов
    const handleToggleAll = () => {
        if (selectedIds.length === filteredTestCases.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredTestCases.map((tc) => tc.id));
        }
    };

    const handleToggleTestCase = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((tcId) => tcId !== id) : [...prev, id]));
    };

    // Функция закрытия диалога
    const handleClose = () => {
        if (!isSubmitting) {
            setSearchQuery('');
            setSelectedIds([]);
            onClose();
        }
    };

    // Отправка выбранных тест-кейсов
    const handleSubmit = async () => {
        await onSubmit(selectedIds);
        setSelectedIds([]);
        setSearchQuery('');
    };

    // Получение цвета для приоритета
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'error';
            case 'MEDIUM':
                return 'warning';
            case 'LOW':
                return 'success';
            default:
                return 'default';
        }
    };

    // Все ли тест-кейсы выбраны
    const allSelected = filteredTestCases.length > 0 && selectedIds.length === filteredTestCases.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < filteredTestCases.length;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    height: '80vh',
                    maxHeight: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography variant="inherit">{t('testPlans.addTestCases.title')}</Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" disabled={isSubmitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '16px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        placeholder={t('testPlans.addTestCases.search')}
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                        {t('testPlans.addTestCases.selected')} ({selectedIds.length})
                    </Typography>
                </Box>

                <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredTestCases.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography color="textSecondary">
                                {t('testPlans.addTestCases.noTestCasesFound')}
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={someSelected}
                                                checked={allSelected}
                                                onChange={handleToggleAll}
                                                disabled={filteredTestCases.length === 0}
                                            />
                                        </TableCell>
                                        <TableCell>{t('testCases.columns.title')}</TableCell>
                                        <TableCell align="center">{t('testCases.columns.priority')}</TableCell>
                                        <TableCell align="center">{t('testCases.columns.status')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTestCases.map((testCase) => {
                                        const isSelected = selectedIds.includes(testCase.id);

                                        return (
                                            <TableRow
                                                key={testCase.id}
                                                hover
                                                onClick={() => handleToggleTestCase(testCase.id)}
                                                selected={isSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isSelected} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {testCase.title}
                                                    </Typography>
                                                    {testCase.description && (
                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            noWrap
                                                            sx={{ maxWidth: 400 }}
                                                        >
                                                            {testCase.description}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={t(
                                                            `testCases.priority.${testCase.testCasePriority.toLowerCase()}`,
                                                        )}
                                                        color={getPriorityColor(testCase.testCasePriority)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={t(
                                                            `testCases.status.${testCase.testCaseStatus.toLowerCase()}`,
                                                        )}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    {selectedIds.length
                        ? t('testPlans.selectedCount', { count: selectedIds.length })
                        : t('testPlans.addTestCases.noTestCasesSelected')}
                </Typography>
                <Box>
                    <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedIds.length === 0}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                        sx={{ ml: 1 }}
                    >
                        {isSubmitting ? t('common.saving') : t('testPlans.addTestCases.add')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
