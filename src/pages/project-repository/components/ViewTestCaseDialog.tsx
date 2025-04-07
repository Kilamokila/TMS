import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Tabs,
    Tab,
    Chip,
    Divider,
    Paper,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { TestCaseResponseDto } from '@services/api/models';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`test-case-tabpanel-${index}`}
            aria-labelledby={`test-case-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `test-case-tab-${index}`,
        'aria-controls': `test-case-tabpanel-${index}`,
    };
}

interface ViewTestCaseDialogProps {
    open: boolean;
    testCase?: TestCaseResponseDto;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const ViewTestCaseDialog: React.FC<ViewTestCaseDialogProps> = ({
    open,
    testCase,
    onClose,
    onEdit,
    onDelete,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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

    if (!testCase) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
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
                <Typography variant="inherit" noWrap sx={{ maxWidth: '80%' }}>
                    {testCase.title}
                </Typography>
                <Box>
                    <IconButton
                        edge="end"
                        color="primary"
                        onClick={onEdit}
                        aria-label={t('common.edit')}
                        sx={{ mr: 1 }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        edge="end"
                        color="error"
                        onClick={onDelete}
                        aria-label={t('common.delete')}
                        sx={{ mr: 1 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label={t('common.close')}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="test case tabs">
                    <Tab label={t('testCases.tabs.general')} {...a11yProps(0)} />
                    <Tab label={t('testCases.tabs.runHistory')} {...a11yProps(1)} />
                    <Tab label={t('testCases.tabs.changeHistory')} {...a11yProps(2)} />
                </Tabs>
            </Box>
            <DialogContent sx={{ padding: '0 24px' }}>
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Информация о приоритете и статусе */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                                <Typography variant="caption" color="textSecondary">
                                    {t('testCases.form.priority')}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={t(`testCases.priority.${testCase.testCasePriority.toLowerCase()}`)}
                                        color={getPriorityColor(testCase.testCasePriority)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="textSecondary">
                                    {t('testCases.form.status')}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={t(`testCases.status.${testCase.testCaseStatus.toLowerCase()}`)}
                                        color={getStatusColor(testCase.testCaseStatus)}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Описание */}
                        {testCase.description && (
                            <Box>
                                <Typography variant="subtitle2">{t('testCases.form.description')}</Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        mt: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <Typography variant="body2">{testCase.description}</Typography>
                                </Paper>
                            </Box>
                        )}

                        {/* Предусловия */}
                        {testCase.preConditions && (
                            <Box>
                                <Typography variant="subtitle2">{t('testCases.form.preConditions')}</Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        mt: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <Typography variant="body2">{testCase.preConditions}</Typography>
                                </Paper>
                            </Box>
                        )}

                        {/* Постусловия */}
                        {testCase.postConditions && (
                            <Box>
                                <Typography variant="subtitle2">{t('testCases.form.postConditions')}</Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        mt: 1,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    <Typography variant="body2">{testCase.postConditions}</Typography>
                                </Paper>
                            </Box>
                        )}

                        {/* Тестовые шаги */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                                {t('testCases.form.testSteps')}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {testCase.testSteps.length > 0 ? (
                                [...testCase.testSteps]
                                    .sort((a, b) => a.orderNumber - b.orderNumber)
                                    .map((step) => (
                                        <Paper
                                            key={step.id}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        bgcolor: 'primary.light',
                                                        color: 'primary.main',
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {step.orderNumber}
                                                </Typography>
                                                <Typography variant="subtitle1">
                                                    {t('testCases.form.step', { number: step.orderNumber })}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">
                                                    {t('testCases.form.action')}
                                                </Typography>
                                                <Paper
                                                    sx={{
                                                        p: 1.5,
                                                        mt: 0.5,
                                                        bgcolor:
                                                            theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
                                                        borderRadius: 1,
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    <Typography variant="body2">{step.action}</Typography>
                                                </Paper>
                                            </Box>
                                            {step.expectedResult && (
                                                <Box>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {t('testCases.form.expectedResult')}
                                                    </Typography>
                                                    <Paper
                                                        sx={{
                                                            p: 1.5,
                                                            mt: 0.5,
                                                            bgcolor:
                                                                theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
                                                            borderRadius: 1,
                                                            wordBreak: 'break-word',
                                                        }}
                                                    >
                                                        <Typography variant="body2">{step.expectedResult}</Typography>
                                                    </Paper>
                                                </Box>
                                            )}
                                        </Paper>
                                    ))
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: '1px dashed',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography color="textSecondary">{t('testCases.form.noSteps')}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">{t('testCases.noRunHistory')}</Typography>
                    </Box>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">{t('testCases.noChangeHistory')}</Typography>
                    </Box>
                </TabPanel>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Button onClick={onClose} color="primary">
                    {t('common.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
