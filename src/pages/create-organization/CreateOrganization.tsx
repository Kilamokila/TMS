import React from 'react';
import { Box, Typography, Container, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CreateOrganizationForm } from './components/CreateOrganizationForm';
import { OrganizationSVG } from '@assets/svg';

export const CreateOrganization: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {t('organizations.lastStep')}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    {t('organizations.createDescription')}
                </Typography>

                <Paper
                    elevation={4}
                    sx={{ p: 4, mt: 8, bg: theme.palette.background.default, display: 'flex', gap: '70px' }}
                >
                    <CreateOrganizationForm />
                    <OrganizationSVG />
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}></Box>
            </Box>
        </Container>
    );
};
