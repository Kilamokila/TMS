import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button } from '@mui/material';
import { EmptyStateSVG } from '@assets/svg';

interface ProjectEmptyStateProps {
    onCreateProjectClick: () => void;
}

export const ProjectEmptyState: React.FC<ProjectEmptyStateProps> = ({ onCreateProjectClick }) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 0,
                px: 0,
                height: '100%',
                minHeight: 400,
            }}
        >
            <Typography variant="h5" component="h2" gutterBottom>
                {t('projects.noProjectsFound')}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 750 }}>
                {t('testCases.emptyState.description')}
            </Typography>

            <Button variant="contained" color="primary" onClick={onCreateProjectClick} size="large">
                {t('projects.createNewProject')}
            </Button>
            <Box sx={{ mb: 4, maxWidth: 400 }}>
                <EmptyStateSVG />
            </Box>
        </Box>
    );
};
