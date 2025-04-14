import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

interface EmptyStateProps {
    onCreateTestPlan: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTestPlan }) => {
    const { t } = useTranslation();

    return (
        <Paper
            sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'background.paper',
                border: '1px dashed',
                borderColor: 'divider',
                maxWidth: 600,
                mx: 'auto',
                my: 4,
            }}
        >
            <AssignmentOutlinedIcon
                sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.7,
                }}
            />
            <Typography variant="h5" component="h2" gutterBottom>
                {t('testPlans.emptyState.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 450 }}>
                {t('testPlans.emptyState.description')}
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onCreateTestPlan}
                    sx={{ fontWeight: 500 }}
                >
                    {t('testPlans.createTestPlan')}
                </Button>
            </Box>
        </Paper>
    );
};
