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
import { TestCaseFormData } from '../schema';
import { TestCaseForm } from './TestCaseForm';
import { TestCaseResponseDto } from '@services/api/models';

interface CreateEditTestCaseDialogProps {
    open: boolean;
    testCase?: TestCaseResponseDto;
    onClose: () => void;
    onSubmit: (data: TestCaseFormData) => Promise<void | TestCaseResponseDto>;
    isSubmitting: boolean;
    onDeleteTestStep?: (testStepId: number, testCaseId: number) => Promise<void>;
}

export const CreateEditTestCaseDialog: React.FC<CreateEditTestCaseDialogProps> = ({
    open,
    testCase,
    onClose,
    onSubmit,
    isSubmitting,
    onDeleteTestStep,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const isEditMode = !!testCase;

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    const handleSubmit = async (data: TestCaseFormData) => {
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
                    {isEditMode ? t('testCases.editTestCase') : t('testCases.createTestCase')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" disabled={isSubmitting}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '24px', paddingTop: '24px' }}>
                <TestCaseForm
                    testCase={testCase}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    onDeleteTestStep={onDeleteTestStep}
                />
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
