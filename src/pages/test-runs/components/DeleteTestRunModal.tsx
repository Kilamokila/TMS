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
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from 'react-i18next';
import { TestRun } from '../model/testRun';

interface DeleteTestRunModalProps {
    open: boolean;
    testRun: TestRun;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
}

export const DeleteTestRunModal: React.FC<DeleteTestRunModalProps> = ({
    open,
    testRun,
    onClose,
    onConfirm,
    isDeleting = false,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={!isDeleting ? onClose : undefined}
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle>{t('testRuns.delete.title')}</DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <WarningIcon color="warning" sx={{ fontSize: 32, mt: 0.5 }} />

                    <Box>
                        <Typography variant="body1" paragraph>
                            {t('testRuns.delete.confirmMessage')}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {testRun.title}
                        </Typography>

                        <Typography variant="body2" color="error.main">
                            {t('testRuns.delete.warningMessage')}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit" disabled={isDeleting}>
                    {t('common.cancel')}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={isDeleting}
                    startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {isDeleting ? t('common.deleting') : t('common.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
