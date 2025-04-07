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

interface DeleteTestCaseDialogProps {
    open: boolean;
    testCaseTitle?: string;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteTestCaseDialog: React.FC<DeleteTestCaseDialogProps> = ({
    open,
    testCaseTitle,
    isDeleting,
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation();

    const handleClose = () => {
        if (!isDeleting) {
            onClose();
        }
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
                },
            }}
        >
            <DialogTitle>{t('testCases.deleteTestCase')}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="body1">{t('testCases.deleteConfirmation')}</Typography>
                </Box>
                {testCaseTitle && (
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                        {testCaseTitle}
                    </Typography>
                )}
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {t('testCases.deleteWarning')}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} disabled={isDeleting}>
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
