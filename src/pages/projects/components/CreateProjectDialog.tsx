import React from 'react';
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
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProjectFormData, projectSchema } from '../schema';

interface CreateProjectDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
    open,
    onClose,
    onSubmit,
    isSubmitting = false,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const { control, handleSubmit, reset } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            organizationId: 1,
        },
        mode: 'onTouched',
    });

    const handleFormSubmit: SubmitHandler<ProjectFormData> = async (data) => {
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

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
                <Typography variant="inherit">{t('projects.projectCreate.title')}</Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
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
                                    label={t('projects.projectCreate.projectName')}
                                    fullWidth
                                    required
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error &&
                                        t(fieldState.error.message as string, {
                                            field: t('projects.projectCreate.createProject.projectName'),
                                            count: 100,
                                        })
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="code"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('projects.projectCreate.projectCode')}
                                    fullWidth
                                    required
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error
                                            ? t(fieldState.error.message as string, {
                                                  field: t('projects.projectCreate.projectCode'),
                                                  count: 16,
                                              })
                                            : t('projects.projectCreate.codeHint')
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label={t('projects.projectCreate.description')}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error &&
                                        t(fieldState.error.message as string, {
                                            field: t('projects.projectCreate.description'),
                                            count: 1000,
                                        })
                                    }
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        padding: '16px 24px',
                        borderTop: `1px solid ${theme.palette.divider}`,
                        justifyContent: 'flex-end',
                        gap: 1,
                    }}
                >
                    <Button onClick={handleClose} color="inherit">
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? t('common.loading') : t('common.create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
