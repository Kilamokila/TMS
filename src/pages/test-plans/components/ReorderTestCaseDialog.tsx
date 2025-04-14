import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    CircularProgress,
    useTheme,
    Paper,
    Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TestCaseResponseDto } from '@services/api/models/testCase';
import { TestCaseOrderData } from '../schema';

// DND-библиотеки не используем для простоты, делаем reordering через кнопки

interface ReorderTestCasesDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (orderedTestCases: TestCaseOrderData[]) => Promise<void>;
    isSubmitting: boolean;
    testCases: (TestCaseResponseDto & { orderNumber?: number })[];
}

export const ReorderTestCasesDialog: React.FC<ReorderTestCasesDialogProps> = ({
    open,
    onClose,
    onSubmit,
    isSubmitting,
    testCases,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // Состояние для упорядоченных тест-кейсов
    const [orderedTestCases, setOrderedTestCases] = useState<(TestCaseResponseDto & { orderNumber: number })[]>([]);

    // Инициализация упорядоченных тест-кейсов
    useEffect(() => {
        if (open && testCases.length > 0) {
            // Сортируем тест-кейсы по порядковому номеру
            const sorted = [...testCases]
                .filter((tc) => tc.orderNumber !== undefined)
                .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
                .map((tc, index) => ({
                    ...tc,
                    orderNumber: index + 1, // Переназначаем порядковые номера для корректного отображения
                }));

            setOrderedTestCases(sorted as (TestCaseResponseDto & { orderNumber: number })[]);
        }
    }, [open, testCases]);

    // Обработчики изменения порядка
    const moveUp = (index: number) => {
        if (index <= 0) return;

        const newOrder = [...orderedTestCases];
        const temp = newOrder[index];

        newOrder[index] = { ...newOrder[index - 1], orderNumber: index + 1 };
        newOrder[index - 1] = { ...temp, orderNumber: index };

        setOrderedTestCases(newOrder);
    };

    const moveDown = (index: number) => {
        if (index >= orderedTestCases.length - 1) return;

        const newOrder = [...orderedTestCases];
        const temp = newOrder[index];

        newOrder[index] = { ...newOrder[index + 1], orderNumber: index + 1 };
        newOrder[index + 1] = { ...temp, orderNumber: index + 2 };

        setOrderedTestCases(newOrder);
    };

    // Функция закрытия диалога
    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    // Отправка нового порядка тест-кейсов
    const handleSubmit = async () => {
        const updatedOrder = orderedTestCases.map((tc) => ({
            testCaseId: tc.id,
            orderNumber: tc.orderNumber,
        }));

        await onSubmit(updatedOrder);
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
                    maxHeight: '80vh',
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
                <Typography variant="inherit">{t('testPlans.reorderTestCases.title')}</Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" disabled={isSubmitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '16px 24px' }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" color="textSecondary">
                        {t('testPlans.reorderTestCases.info')}
                    </Typography>
                </Box>

                <Paper variant="outlined" sx={{ mt: 2 }}>
                    <List disablePadding>
                        {orderedTestCases.map((testCase, index) => (
                            <React.Fragment key={testCase.id}>
                                <ListItem
                                    sx={{
                                        px: 2,
                                        py: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                minWidth: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.light',
                                                color: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {testCase.orderNumber}
                                        </Typography>
                                    </Box>

                                    <ListItemText
                                        primary={testCase.title}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    label={t(
                                                        `testCases.priority.${testCase.testCasePriority.toLowerCase()}`,
                                                    )}
                                                    color={getPriorityColor(testCase.testCasePriority)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                    />

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            aria-label="Move up"
                                        >
                                            <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => moveDown(index)}
                                            disabled={index === orderedTestCases.length - 1}
                                            aria-label="Move down"
                                        >
                                            <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                {index < orderedTestCases.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    justifyContent: 'flex-end',
                }}
            >
                <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {isSubmitting ? t('common.saving') : t('testPlans.reorderTestCases.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
