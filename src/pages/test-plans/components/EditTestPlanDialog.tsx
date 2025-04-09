import React from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { TestPlanFormData } from '../schema';
import { TestPlanForm } from './TestPlanForm';
import { TestPlanResponseDto } from '@services/api/models';

interface EditTestPlanDialogProps {
    open: boolean;
    testPlan?: TestPlanResponseDto;
    onClose: () => void;
    onSubmit: (data: TestPlanFormData) => Promise<void>;
    isSubmitting: boolean;
    userId: number;
}

export const EditTestPlanDialog: React.FC<EditTestPlanDialogProps> = ({
    open,
    testPlan,
    onClose,
    onSubmit,
    isSubmitting,
    userId,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const isEditMode = !!testPlan;

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    const handleSubmit = async (data: TestPlanFormData) => {
        await onSubmit(data);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
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
                <Typography variant="inherit">
                    {isEditMode ? t('testPlans.editTestPlan') : t('testPlans.createTestPlan')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" disabled={isSubmitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px', paddingTop: '24px' }}>
                <TestPlanForm testPlan={testPlan} onSubmit={handleSubmit} isSubmitting={isSubmitting} userId={userId} />
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
                    variant="contained"
                    color="primary"
                    onClick={() => document.forms[0].requestSubmit()}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                    {isSubmitting ? t('common.saving') : isEditMode ? t('common.save') : t('common.create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
