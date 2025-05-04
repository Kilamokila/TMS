import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useKeycloak } from '@context/auth/useKeycloak';
import { useNavigate } from '@tanstack/react-router';
import styles from './styles.module.less';
import { PlaceholderPicSVG } from '@assets/svg';
import { LandingHeader } from './LandingHeader';
import { useTranslation } from 'react-i18next';

export const LandingPage: React.FC = () => {
    const { keycloak, isAuthenticated, initialized } = useKeycloak();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // If already authenticated, redirect to projects
    useEffect(() => {
        if (initialized && isAuthenticated()) {
            navigate({ to: '/projects' });
        }
    }, [initialized, isAuthenticated, navigate]);

    const handleLogin = () => {
        keycloak?.login();
    };

    return (
        <Box className={styles.wrapper}>
            <LandingHeader onLogin={handleLogin} />
            <Container maxWidth="lg" className={styles.container}>
                <Box className={styles.content}>
                    <Box className={styles.textContent}>
                        <Typography variant="h2" component="h2" className={styles.title}>
                            {t('landing.title')}
                        </Typography>
                        <Typography variant="body1" className={styles.description}>
                            {t('landing.description')}
                        </Typography>
                    </Box>
                    <Box className={styles.imageContainer}>
                        <PlaceholderPicSVG className={styles.placeholderImage} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
