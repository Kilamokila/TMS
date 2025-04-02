import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Divider,
    SelectChangeEvent,
    FormLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { TestRun, TestRunStatus } from '../model/testRun';

interface EditTestRunModalProps {
    open: boolean;
    testRun: TestRun;
    onClose: () => void;
    onSubmit: (data: EditTestRunData) => void;
}

export interface EditTestRunData {
    title: string;
    description?: string;
    environment: string;
    status: TestRunStatus;
}

export const EditTestRunModal: React.FC<EditTestRunModalProps> = ({ open, testRun, onClose, onSubmit }) => {
    const { t } = useTranslation();

    // Инициализируем форму данными из тестового прогона
    const [formData, setFormData] = useState<EditTestRunData>({
        title: '',
        description: '',
        environment: '',
        status: 'inProgress' as TestRunStatus,
    });

    // Состояние для ошибок валидации
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Обновляем форму при изменении testRun
    useEffect(() => {
        if (testRun) {
            setFormData({
                title: testRun.title,
                description: testRun.description || '',
                environment: testRun.environment,
                status: testRun.status,
            });
        }
    }, [testRun]);

    // Обработчик изменения текстовых полей
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Обработчик изменения выпадающих списков
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Валидация формы
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = t('validation.required', { field: t('testRuns.edit.titleLabel') });
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Typography variant="h6" component="div">
                    {t('testRuns.edit.title')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 1 }}>
                <Grid container spacing={3}>
                    {/* Заголовок */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 1 }}>
                            <FormLabel required htmlFor="title-input">
                                {t('testRuns.edit.titleLabel')}
                            </FormLabel>
                        </Box>
                        <TextField
                            fullWidth
                            id="title-input"
                            name="title"
                            placeholder={t('testRuns.newTestRun.titlePlaceholder')}
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            error={!!errors.title}
                            helperText={errors.title}
                            // Убираем встроенный лейбл, так как добавили отдельный FormLabel выше
                            InputLabelProps={{ shrink: false }}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Описание */}
                    <Grid item xs={12}>
                        <Box sx={{ mb: 1 }}>
                            <FormLabel htmlFor="description-input">{t('testRuns.edit.descriptionLabel')}</FormLabel>
                        </Box>
                        <TextField
                            fullWidth
                            id="description-input"
                            name="description"
                            placeholder={t('testRuns.newTestRun.descriptionPlaceholder')}
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            // Убираем встроенный лейбл
                            InputLabelProps={{ shrink: false }}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    {/* Статус и окружение */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                            <FormLabel htmlFor="status-select">{t('testRuns.edit.statusLabel')}</FormLabel>
                        </Box>
                        <FormControl fullWidth>
                            <Select
                                id="status-select"
                                name="status"
                                value={formData.status}
                                onChange={handleSelectChange}
                                displayEmpty
                                // Убираем встроенный лейбл
                                labelId=""
                            >
                                <MenuItem value="inProgress">{t('testRuns.status.inProgress')}</MenuItem>
                                <MenuItem value="passed">{t('testRuns.status.passed')}</MenuItem>
                                <MenuItem value="failed">{t('testRuns.status.failed')}</MenuItem>
                                <MenuItem value="blocked">{t('testRuns.status.blocked')}</MenuItem>
                                <MenuItem value="invalid">{t('testRuns.status.invalid')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1 }}>
                            <FormLabel htmlFor="environment-input">{t('testRuns.edit.environmentLabel')}</FormLabel>
                        </Box>
                        <TextField
                            fullWidth
                            id="environment-input"
                            name="environment"
                            value={formData.environment}
                            onChange={handleInputChange}
                            // Убираем встроенный лейбл
                            InputLabelProps={{ shrink: false }}
                            variant="outlined"
                        />
                    </Grid>

                    {/* Информационное сообщение */}
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2, bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
                            <Typography variant="body2" color="info.dark">
                                {t('testRuns.edit.helpText')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
