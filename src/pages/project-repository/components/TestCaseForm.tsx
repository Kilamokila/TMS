import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
    Box,
    TextField,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Button,
    Divider,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TestCaseFormData, testCaseSchema } from '../schema';
import { TestCaseResponseDto } from '@services/api/models';

interface TestCaseFormProps {
    testCase?: TestCaseResponseDto;
    onSubmit: (data: TestCaseFormData) => void;
    isSubmitting: boolean;
}

export const TestCaseForm: React.FC<TestCaseFormProps> = ({ testCase, onSubmit, isSubmitting }) => {
    const { t } = useTranslation();

    // Инициализация формы с данными тестового сценария (если он передан)
    const defaultValues: TestCaseFormData = testCase
        ? {
              title: testCase.title,
              description: testCase.description || '',
              preConditions: testCase.preConditions || '',
              postConditions: testCase.postConditions || '',
              testCasePriority: testCase.testCasePriority,
              testCaseStatus: testCase.testCaseStatus,
              testSteps: testCase.testSteps.map((step) => ({
                  id: step.id,
                  orderNumber: step.orderNumber,
                  action: step.action,
                  expectedResult: step.expectedResult || '',
              })),
          }
        : {
              title: '',
              description: '',
              preConditions: '',
              postConditions: '',
              testCasePriority: 'MEDIUM',
              testCaseStatus: 'DRAFT',
              testSteps: [{ orderNumber: 1, action: '', expectedResult: '' }],
          };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TestCaseFormData>({
        resolver: zodResolver(testCaseSchema),
        defaultValues,
        mode: 'onChange',
    });

    // Управление полями массива тестовых шагов
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'testSteps',
    });

    // Добавление нового шага
    const handleAddStep = () => {
        append({
            orderNumber: fields.length + 1,
            action: '',
            expectedResult: '',
        });
    };

    // Обновление порядковых номеров при перемещении шагов
    // const updateOrderNumbers = () => {
    //     fields.forEach((field, index) => {
    //         update(index, { ...field, orderNumber: index + 1 });
    //     });
    // };

    // const handleDeleteStep = async (index: number, stepId?: unknown) => {
    //     console.log('handleDeleteStep called with index:', index, 'stepId:', stepId);
    //     const numericStepId = typeof stepId === 'number' ? stepId : undefined;

    //     if (numericStepId && testCase && onDeleteTestStep) {
    //         console.log('Calling onDeleteTestStep with stepId:', numericStepId, 'testCaseId:', testCase.id);

    //         try {
    //             await onDeleteTestStep(numericStepId, testCase.id);
    //             console.log('onDeleteTestStep completed successfully');
    //         } catch (error) {
    //             console.error('Failed to delete test step:', error);

    //             return;
    //         }
    //     } else {
    //         console.log('Skipping onDeleteTestStep: ', { numericStepId, testCase, onDeleteTestStep });
    //     }

    //     console.log('Removing step at index:', index);
    //     remove(index);
    //     updateOrderNumbers();
    //     console.log('Step removed and order numbers updated');
    // };

    const handleDeleteStep = async (index: number) => {
        remove(index);
    };

    // Обработка отправки формы
    const handleFormSubmit = (data: TestCaseFormData) => {
        // Обновляем порядковые номера перед отправкой
        const updatedData = {
            ...data,
            testSteps: data.testSteps.map((step, index) => ({
                ...step,
                orderNumber: index + 1,
            })),
        };

        onSubmit(updatedData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Заголовок */}
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testCases.form.title')}
                            fullWidth
                            required
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testCases.form.title'),
                                    count: 200,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Приоритет и Статус */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <Controller
                        name="testCasePriority"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error} disabled={isSubmitting}>
                                <InputLabel id="priority-label">{t('testCases.form.priority')}</InputLabel>
                                <Select {...field} labelId="priority-label" label={t('testCases.form.priority')}>
                                    <MenuItem value="LOW">{t('testCases.priority.low')}</MenuItem>
                                    <MenuItem value="MEDIUM">{t('testCases.priority.medium')}</MenuItem>
                                    <MenuItem value="HIGH">{t('testCases.priority.high')}</MenuItem>
                                </Select>
                                {fieldState.error && (
                                    <FormHelperText>{t(fieldState.error.message as string)}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="testCaseStatus"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error} disabled={isSubmitting}>
                                <InputLabel id="status-label">{t('testCases.form.status')}</InputLabel>
                                <Select {...field} labelId="status-label" label={t('testCases.form.status')}>
                                    <MenuItem value="DRAFT">{t('testCases.status.draft')}</MenuItem>
                                    <MenuItem value="ACTIVE">{t('testCases.status.active')}</MenuItem>
                                    <MenuItem value="DEPRECATED">{t('testCases.status.deprecated')}</MenuItem>
                                </Select>
                                {fieldState.error && (
                                    <FormHelperText>{t(fieldState.error.message as string)}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Box>

                {/* Описание */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testCases.form.description')}
                            multiline
                            rows={4}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testCases.form.description'),
                                    count: 2000,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Предусловия */}
                <Controller
                    name="preConditions"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testCases.form.preConditions')}
                            multiline
                            rows={2}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testCases.form.preConditions'),
                                    count: 1000,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Постусловия */}
                <Controller
                    name="postConditions"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('testCases.form.postConditions')}
                            multiline
                            rows={2}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={
                                fieldState.error &&
                                t(fieldState.error.message as string, {
                                    field: t('testCases.form.postConditions'),
                                    count: 1000,
                                })
                            }
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* Тестовые шаги */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="inherit">{t('testCases.form.testSteps')}</Typography>
                        <Button startIcon={<AddIcon />} onClick={handleAddStep} disabled={isSubmitting}>
                            {t('testCases.form.addStep')}
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {fields.map((field, index) => (
                        <Paper
                            key={field.id}
                            sx={{
                                p: 2,
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                position: 'relative',
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
                                    {index + 1}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {t('testCases.form.step', { number: index + 1 })}
                                </Typography>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteStep(index)}
                                    sx={{ ml: 'auto' }}
                                    aria-label={t('common.delete')}
                                    disabled={isSubmitting}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Действие */}
                            <Controller
                                name={`testSteps.${index}.action`}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={t('testCases.form.action')}
                                        fullWidth
                                        required
                                        error={!!fieldState.error}
                                        helperText={
                                            fieldState.error &&
                                            t(fieldState.error.message as string, {
                                                field: t('testCases.form.action'),
                                            })
                                        }
                                        disabled={isSubmitting}
                                    />
                                )}
                            />

                            {/* Ожидаемый результат */}
                            <Controller
                                name={`testSteps.${index}.expectedResult`}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={t('testCases.form.expectedResult')}
                                        multiline
                                        rows={2}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={
                                            fieldState.error &&
                                            t(fieldState.error.message as string, {
                                                field: t('testCases.form.expectedResult'),
                                            })
                                        }
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                        </Paper>
                    ))}

                    {fields.length === 0 && (
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
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddStep}
                                sx={{ mt: 1 }}
                                disabled={isSubmitting}
                            >
                                {t('testCases.form.addFirstStep')}
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Если есть ошибка в массиве testSteps */}
                {errors.testSteps && <FormHelperText error>{t('testCases.form.testStepsError')}</FormHelperText>}
            </Box>
        </form>
    );
};
