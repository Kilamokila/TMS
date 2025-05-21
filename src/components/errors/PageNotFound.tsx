import React, { memo } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@tanstack/react-router';
import { PageNotFoundSVG } from '@assets/svg';
import { flexMixins } from '@src/styles';

export const PageNotFound: React.FC = memo(() => {
    const { t } = useTranslation();

    const router = useRouter();

    function handleGoBack() {
        router.history.back();
    }

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    ...flexMixins.column,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 88px)',
                    padding: 4,
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <Typography variant="h4" component="h1" fontWeight="medium">
                    {t('errors.resourceNotFound')}
                </Typography>
                <PageNotFoundSVG />
                <Button variant="contained" color="primary" onClick={handleGoBack} size="large" sx={{ mt: 2 }}>
                    {t('common.back')}
                </Button>
            </Box>
        </Container>
    );
});

PageNotFound.displayName = 'PageNotFound';
