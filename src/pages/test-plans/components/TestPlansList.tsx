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
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { TestPlanWithStats, TestPlanStatus } from '@services/api/models/testPlans';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useLanguageContext } from '@context/language/languageContext';
import { LANGUAGE } from '@context/language/types/languageModes';

interface TestPlansListProps {
    testPlans: TestPlanWithStats[];
    isLoading: boolean;
    selectedTestPlans: number[];
    onSelectTestPlan: (id: number, selected: boolean) => void;
    onSelectAllTestPlans: (selected: boolean) => void;
    onViewTestPlan: (id: number) => void;
    onEditTestPlan: (id: number) => void;
    onDeleteTestPlan: (id: number) => void;
    onCreateTestRun: (testPlanId: number) => void;
}

export const TestPlansList: React.FC<TestPlansListProps> = ({
    testPlans,
    isLoading,
    selectedTestPlans,
    onSelectTestPlan,
    onSelectAllTestPlans,
    onViewTestPlan,
    onEditTestPlan,
    onDeleteTestPlan,
    onCreateTestRun,
}) => {
    const { t } = useTranslation();
    const { language } = useLanguageContext();

    // Определяем, выбраны ли все тестовые планы
    const allSelected = testPlans.length > 0 && selectedTestPlans.length === testPlans.length;
    const someSelected = selectedTestPlans.length > 0 && selectedTestPlans.length < testPlans.length;

    // Форматирование даты с учетом локализации
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const locale = language === LANGUAGE.RU ? ru : enUS;

            return formatDistanceToNow(date, { addSuffix: true, locale });
        } catch (error) {
            console.error(error);

            return dateStr;
        }
    };

    // Обработчики событий
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAllTestPlans(event.target.checked);
    };

    const handleSelectTestPlan = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onSelectTestPlan(id, event.target.checked);
    };

    const handleRowClick = (id: number) => {
        onViewTestPlan(id);
    };

    // Функция для определения цвета статуса
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
                            <TableCell>{t('testPlans.columns.name')}</TableCell>
                            <TableCell align="center">{t('testPlans.columns.status')}</TableCell>
                            <TableCell align="center">{t('testPlans.columns.testCases')}</TableCell>
                            <TableCell>{t('testPlans.columns.lastUpdated')}</TableCell>
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
                                    <Skeleton variant="text" width={30} sx={{ mx: 'auto' }} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width="100%" />
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Skeleton variant="circular" width={28} height={28} />
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

    // Если нет тестовых планов
    if (!isLoading && !testPlans.length) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="textSecondary">
                    {t('testPlans.noTestPlansFound')}
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
                        <TableCell>{t('testPlans.columns.name')}</TableCell>
                        <TableCell align="center">{t('testPlans.columns.status')}</TableCell>
                        <TableCell align="center">{t('testPlans.columns.testCases')}</TableCell>
                        <TableCell>{t('testPlans.columns.lastUpdated')}</TableCell>
                        <TableCell align="right">{t('testPlans.columns.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testPlans.map((testPlan) => {
                        const isSelected = selectedTestPlans.includes(testPlan.id);

                        return (
                            <TableRow
                                key={testPlan.id}
                                hover
                                onClick={() => handleRowClick(testPlan.id)}
                                selected={isSelected}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={(e) => handleSelectTestPlan(testPlan.id, e)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1" fontWeight={500}>
                                        {testPlan.name}
                                    </Typography>
                                    {testPlan.description && (
                                        <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 500 }}>
                                            {testPlan.description}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={t(`testPlans.status.${testPlan.status.toLowerCase()}`)}
                                        color={getStatusColor(testPlan.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2">{testPlan.testCasesCount || 0}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="textSecondary">
                                        {formatDate(testPlan.updatedAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Tooltip title={t('testRuns.startNewTestRun')}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onCreateTestRun(testPlan.id);
                                                }}
                                            >
                                                <PlayCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('common.edit')}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditTestPlan(testPlan.id);
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
                                                    onDeleteTestPlan(testPlan.id);
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
