import React, { ReactNode } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    CircularProgress,
    useTheme,
    DialogProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export interface FormDialogProps extends Omit<DialogProps, 'title'> {
    title: ReactNode;
    children: ReactNode;
    onClose: () => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    cancelButtonText?: string;
    submitButtonText?: string;
    isSubmitting?: boolean;
    submitDisabled?: boolean;
    showSubmitButton?: boolean;
    showCancelButton?: boolean;
    footerContent?: ReactNode;
}

export function FormDialog({
    title,
    children,
    onClose,
    onSubmit,
    onCancel,
    cancelButtonText,
    submitButtonText,
    isSubmitting = false,
    submitDisabled = false,
    showSubmitButton = true,
    showCancelButton = true,
    footerContent,
    ...dialogProps
}: FormDialogProps): React.ReactElement {
    const theme = useTheme();
    const { t } = useTranslation();

    // Используем onClose в качестве onCancel, если onCancel не предоставлен
    const handleCancel = onCancel || onClose;

    return (
        <Dialog
            {...dialogProps}
            onClose={(event, reason) => {
                // Не закрывать диалог при клике за его пределами, если идет отправка
                if (isSubmitting && reason === 'backdropClick') {
                    return;
                }

                // Стандартное поведение закрытия
                if (dialogProps.onClose) {
                    dialogProps.onClose(event, reason);
                }

                onClose();
            }}
            PaperProps={{
                ...dialogProps.PaperProps,
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    ...(dialogProps.PaperProps?.sx || {}),
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
                {typeof title === 'string' ? <Typography variant="inherit">{title}</Typography> : title}

                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCancel}
                    aria-label="close"
                    disabled={isSubmitting}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '24px', paddingTop: '24px' }}>{children}</DialogContent>

            <DialogActions
                sx={{
                    padding: '16px 24px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    justifyContent: footerContent ? 'space-between' : 'flex-end',
                    gap: 1,
                }}
            >
                {footerContent && <div>{footerContent}</div>}

                <div style={{ display: 'flex', gap: '8px' }}>
                    {showCancelButton && (
                        <Button onClick={handleCancel} color="inherit" disabled={isSubmitting}>
                            {cancelButtonText || t('common.cancel')}
                        </Button>
                    )}

                    {showSubmitButton && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onSubmit}
                            disabled={isSubmitting || submitDisabled}
                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                        >
                            {isSubmitting ? t('common.saving') : submitButtonText || t('common.save')}
                        </Button>
                    )}
                </div>
            </DialogActions>
        </Dialog>
    );
}
