import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

interface EmptyStateProps {
    onCreateTestCase: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTestCase }) => {
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
            <FolderOpenIcon
                sx={{
                    fontSize: 60,
                    color: 'text.secondary',
                    mb: 2,
                    opacity: 0.7,
                }}
            />
            <Typography variant="h5" component="h2" gutterBottom>
                {t('testCases.emptyState.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 450 }}>
                {t('testCases.emptyState.description')}
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onCreateTestCase}
                    sx={{ fontWeight: 500 }}
                >
                    {t('testCases.createTestCase')}
                </Button>
            </Box>
        </Paper>
    );
};
