// src/pages/projects/components/DeleteProjectDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';

interface DeleteProjectDialogProps {
    open: boolean;
    projectName?: string;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
    error?: string;
}

export const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
    open,
    projectName,
    isDeleting,
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={!isDeleting ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle>{t('projects.deleteProject')}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="body1">{t('projects.deleteProjectConfirm')}</Typography>
                </Box>
                {projectName && (
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                        {projectName}
                    </Typography>
                )}
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {t('projects.deleteProjectWarning')}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isDeleting}>
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {isDeleting ? t('common.deleting') : t('common.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
