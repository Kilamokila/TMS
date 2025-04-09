import React from 'react';
import {
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Chip,
    Divider,
    Button,
    Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { TestCaseResponseDto } from '@services/api/models/testCase';

interface TestCasesListProps {
    testCases: (TestCaseResponseDto & { orderNumber?: number })[];
    isLoading: boolean;
    onAddTestCases: () => void;
    onReorderTestCases: () => void;
    onRemoveTestCase: (testCaseId: number) => void;
    onViewTestCase: (testCaseId: number) => void;
    isReorderable?: boolean;
}

export const TestCasesList: React.FC<TestCasesListProps> = ({
    testCases,
    isLoading,
    onAddTestCases,
    onReorderTestCases,
    onRemoveTestCase,
    onViewTestCase,
    isReorderable = true,
}) => {
    const { t } = useTranslation();

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

    // Скелетон для загрузки
    if (isLoading) {
        return (
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        <Skeleton width={200} />
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {[...Array(3)].map((_, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{ px: 1, py: 2 }}>
                            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                            <ListItemText primary={<Skeleton width="60%" />} secondary={<Skeleton width="80%" />} />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="circular" width={32} height={32} />
                            </Box>
                        </ListItem>
                        {index < 2 && <Divider />}
                    </React.Fragment>
                ))}
            </Paper>
        );
    }

    // Если нет тест-кейсов
    if (!testCases.length) {
        return (
            <Paper
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                }}
            >
                <AssignmentOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    {t('testPlans.details.noTestCases')}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {t('testPlans.details.addYourFirst')}
                </Typography>
                <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={onAddTestCases}>
                    {t('testPlans.details.addTestCases')}
                </Button>
            </Paper>
        );
    }

    // Сортируем тест-кейсы по порядковому номеру
    const sortedTestCases = [...testCases].sort((a, b) => {
        if (a.orderNumber !== undefined && b.orderNumber !== undefined) {
            return a.orderNumber - b.orderNumber;
        }

        return 0;
    });

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    {t('testPlans.details.testCasesInPlan')} ({testCases.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<AddIcon />} onClick={onAddTestCases}>
                        {t('testPlans.details.addTestCases')}
                    </Button>
                    {isReorderable && (
                        <Button startIcon={<DragIndicatorIcon />} onClick={onReorderTestCases}>
                            {t('testPlans.details.reorder')}
                        </Button>
                    )}
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
                {sortedTestCases.map((testCase, index) => (
                    <React.Fragment key={testCase.id}>
                        <ListItem
                            sx={{
                                px: 1,
                                py: 2,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                },
                            }}
                        >
                            {testCase.orderNumber !== undefined && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        minWidth: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        mr: 2,
                                    }}
                                >
                                    {testCase.orderNumber}
                                </Typography>
                            )}
                            <ListItemText
                                primary={testCase.title}
                                secondary={
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                            label={t(`testCases.priority.${testCase.testCasePriority.toLowerCase()}`)}
                                            color={getPriorityColor(testCase.testCasePriority)}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={t(`testCases.status.${testCase.testCaseStatus.toLowerCase()}`)}
                                            size="small"
                                        />
                                    </Box>
                                }
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title={t('common.view')}>
                                    <IconButton size="small" onClick={() => onViewTestCase(testCase.id)}>
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t('common.remove')}>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onRemoveTestCase(testCase.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </ListItem>
                        {index < sortedTestCases.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};
