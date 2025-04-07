import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Typography,
    Box,
    Chip,
    Skeleton,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TestCaseResponseDto } from '@services/api/models';

interface TestCaseListProps {
    testCases: TestCaseResponseDto[];
    isLoading: boolean;
    selectedTestCases: number[];
    onSelectTestCase: (id: number, selected: boolean) => void;
    onSelectAllTestCases: (selected: boolean) => void;
    onViewTestCase: (id: number) => void;
    onEditTestCase: (id: number) => void;
    onDeleteTestCase: (id: number) => void;
}

export const TestCaseList: React.FC<TestCaseListProps> = ({
    testCases,
    isLoading,
    selectedTestCases,
    onSelectTestCase,
    onSelectAllTestCases,
    onViewTestCase,
    onEditTestCase,
    onDeleteTestCase,
}) => {
    const { t } = useTranslation();

    // Определяем, выбраны ли все тестовые сценарии
    const allSelected = testCases.length > 0 && selectedTestCases.length === testCases.length;
    const someSelected = selectedTestCases.length > 0 && selectedTestCases.length < testCases.length;

    // Обработчики событий
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAllTestCases(event.target.checked);
    };

    const handleSelectTestCase = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onSelectTestCase(id, event.target.checked);
    };

    const handleRowClick = (id: number) => {
        onViewTestCase(id);
    };

    // Функция для генерации цвета чипа приоритета
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

    // Функция для генерации цвета чипа статуса
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'DRAFT':
                return 'warning';
            case 'DEPRECATED':
                return 'error';
            default:
                return 'default';
        }
    };

    // Скелетон для загрузки
    if (isLoading) {
        return (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox disabled />
                            </TableCell>
                            <TableCell>{t('testCases.columns.title')}</TableCell>
                            <TableCell align="center">{t('testCases.columns.priority')}</TableCell>
                            <TableCell align="center">{t('testCases.columns.status')}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell padding="checkbox">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                </TableCell>
                                <TableCell align="center">
                                    <Skeleton
                                        variant="rectangular"
                                        width={80}
                                        height={24}
                                        sx={{ borderRadius: 4, mx: 'auto' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Skeleton
                                        variant="rectangular"
                                        width={80}
                                        height={24}
                                        sx={{ borderRadius: 4, mx: 'auto' }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Skeleton variant="circular" width={28} height={28} />
                                        <Skeleton variant="circular" width={28} height={28} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    // Если нет тестовых сценариев
    if (!isLoading && !testCases.length) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="textSecondary">
                    {t('testCases.noTestCasesFound')}
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox indeterminate={someSelected} checked={allSelected} onChange={handleSelectAll} />
                        </TableCell>
                        <TableCell>{t('testCases.columns.title')}</TableCell>
                        <TableCell align="center">{t('testCases.columns.priority')}</TableCell>
                        <TableCell align="center">{t('testCases.columns.status')}</TableCell>
                        <TableCell align="right">{t('testCases.columns.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testCases.map((testCase) => {
                        const isSelected = selectedTestCases.includes(testCase.id);

                        return (
                            <TableRow
                                key={testCase.id}
                                hover
                                onClick={() => handleRowClick(testCase.id)}
                                selected={isSelected}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={(e) => handleSelectTestCase(testCase.id, e)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" fontWeight={500}>
                                        {testCase.title}
                                    </Typography>
                                    {testCase.description && (
                                        <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 500 }}>
                                            {testCase.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={t(`testCases.priority.${testCase.testCasePriority.toLowerCase()}`)}
                                        color={getPriorityColor(testCase.testCasePriority)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={t(`testCases.status.${testCase.testCaseStatus.toLowerCase()}`)}
                                        color={getStatusColor(testCase.testCaseStatus)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title={t('common.edit')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditTestCase(testCase.id);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.delete')}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteTestCase(testCase.id);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
