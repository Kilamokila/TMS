import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Box, TextField, FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { TestPlanFormData, testPlanSchema } from '../schema';
import { TestPlanResponseDto, TestPlanStatus } from '@services/api/models/testPlans';

interface TestPlanFormProps {
    testPlan?: TestPlanResponseDto;
    onSubmit: (data: TestPlanFormData) => void;
    isSubmitting: boolean;
    userId: number;
}

export const TestPlanForm: React.FC<TestPlanFormProps> = ({ testPlan, onSubmit, isSubmitting, userId }) => {
    const { t } = useTranslation();

    // Инициализация формы с данными тестового плана (если он передан)
    const defaultValues: TestPlanFormData = testPlan
        ? {
              name: testPlan.name,
              description: testPlan.description || '',
              status: testPlan.status,
              createdBy: testPlan.createdById,
          }
        : {
              name: '',
              description: '',
              status: TestPlanStatus.DRAFT,
              createdBy: userId,
          };

    const { control, handleSubmit } = useForm<TestPlanFormData>({
        resolver: zodResolver(testPlanSchema),
        defaultValues,
        mode: 'onChange',
    });

    // Обработка отправки формы
    const handleFormSubmit = (data: TestPlanFormData) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Название плана */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testPlans.form.name')}
                            placeholder={t('testPlans.form.nameHolder')}
                            fullWidth
                            required
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testPlans.form.name'),
                                    count: 200,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Статус плана */}
                <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth error={!!fieldState.error} disabled={isSubmitting}>
                            <InputLabel id="status-label">{t('testPlans.form.status')}</InputLabel>
                            <Select {...field} labelId="status-label" label={t('testPlans.form.status')}>
                                <MenuItem value={TestPlanStatus.DRAFT}>{t('testPlans.status.draft')}</MenuItem>
                                <MenuItem value={TestPlanStatus.ACTIVE}>{t('testPlans.status.active')}</MenuItem>
                                <MenuItem value={TestPlanStatus.COMPLETED}>{t('testPlans.status.completed')}</MenuItem>
                            </Select>
                            {fieldState.error && (
                                <FormHelperText>{t(fieldState.error.message as string)}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />

                {/* Описание плана */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testPlans.form.description')}
                            placeholder={t('testPlans.form.descriptionHolder')}
                            multiline
                            rows={4}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testPlans.form.description'),
                                    count: 2000,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Скрытое поле для createdBy */}
                <Controller
                    name="createdBy"
                    control={control}
                    render={({ field }) => <input type="hidden" {...field} />}
                />
            </Box>
        </form>
    );
};
