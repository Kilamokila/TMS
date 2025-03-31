import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    FormHelperText,
    CircularProgress,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProjectFormData, projectSchema } from '../schema';
import { ProjectResponseDto } from '@services/api/models';

interface EditProjectDialogProps {
    open: boolean;
    project?: ProjectResponseDto;
    onClose: () => void;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting: boolean;
    error?: string;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
    open,
    project,
    onClose,
    onSubmit,
    isSubmitting,
    error,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            organizationId: 1,
        },
        mode: 'onTouched',
    });

    // Заполняем форму данными проекта при открытии диалога
    useEffect(() => {
        if (project && open) {
            reset({
                name: project.name,
                code: project.code,
                description: project.description || '',
                organizationId: project.organizationId,
            });
        }
    }, [project, open, reset]);

    const handleFormSubmit: SubmitHandler<ProjectFormData> = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    const isEditMode = !!project;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
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
                <Typography variant="h6">
                    {isEditMode ? t('projects.editProject') : t('projects.createProject')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" disabled={isSubmitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent sx={{ padding: '24px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('projects.projectName')}
                                    fullWidth
                                    required
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error &&
                                        t(fieldState.error.message as string, {
                                            field: t('projects.projectName'),
                                            count: 100,
                                        })
                                    }
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                        <Controller
                            name="code"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('projects.projectCode')}
                                    fullWidth
                                    required
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error
                                            ? t(fieldState.error.message as string, {
                                                  field: t('projects.projectCode'),
                                                  count: 16,
                                              })
                                            : isEditMode
                                              ? t('projects.codeCannotBeChanged')
                                              : t('projects.codeHint')
                                    }
                                    disabled={isEditMode || isSubmitting}
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('projects.description')}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error &&
                                        t(fieldState.error.message as string, {
                                            field: t('projects.description'),
                                            count: 1000,
                                        })
                                    }
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                        {/* organizationId здесь скрыт, так как в демо версии не реализовано выбор организации */}
                        <Controller
                            name="organizationId"
                            control={control}
                            render={({ field }) => <input type="hidden" {...field} value={field.value} />}
                        />
                    </Box>

                    {error && (
                        <Box mt={2}>
                            <FormHelperText error>{error}</FormHelperText>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '16px 24px',
                        borderTop: `1px solid ${theme.palette.divider}`,
                        justifyContent: 'flex-end',
                        gap: 1,
                    }}
                >
                    <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                    >
                        {isSubmitting ? t('common.saving') : isEditMode ? t('common.save') : t('common.create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
