import React, { ReactNode } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    DialogProps,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';

export interface ConfirmationDialogProps extends Omit<DialogProps, 'title'> {
    title: ReactNode;
    message: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isLoading?: boolean;
    confirmButtonColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    showWarningIcon?: boolean;
    hint?: ReactNode;
    itemTitle?: string;
}

export function ConfirmationDialog({
    title,
    message,
    onConfirm,
    onCancel,
    confirmButtonText,
    cancelButtonText,
    isLoading = false,
    confirmButtonColor = 'primary',
    showWarningIcon = false,
    hint,
    itemTitle,
    ...dialogProps
}: ConfirmationDialogProps): React.ReactElement {
    const { t } = useTranslation();

    return (
        <Dialog
            {...dialogProps}
            onClose={(event, reason) => {
                // Не закрывать диалог при клике за его пределами, если идет загрузка
                if (isLoading && reason === 'backdropClick') {
                    return;
                }

                // Стандартное поведение закрытия
                if (dialogProps.onClose) {
                    dialogProps.onClose(event, reason);
                }

                onCancel();
            }}
            PaperProps={{
                ...dialogProps.PaperProps,
                sx: {
                    borderRadius: 2,
                    ...(dialogProps.PaperProps?.sx || {}),
                },
            }}
        >
            <DialogTitle>
                {typeof title === 'string' ? <Typography variant="inherit">{title}</Typography> : title}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    {showWarningIcon && <WarningIcon color="warning" sx={{ fontSize: 32, mr: 2, mt: 0.5 }} />}

                    <Box>
                        {typeof message === 'string' ? <Typography variant="body1">{message}</Typography> : message}

                        {itemTitle && (
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                {itemTitle}
                            </Typography>
                        )}

                        {hint && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {hint}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} color="inherit" disabled={isLoading}>
                    {cancelButtonText || t('common.cancel')}
                </Button>

                <Button
                    variant="contained"
                    color={confirmButtonColor}
                    onClick={onConfirm}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {isLoading ? t('common.processing') : confirmButtonText || t('common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
