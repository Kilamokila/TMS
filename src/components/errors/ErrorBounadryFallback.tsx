import React, { memo } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ErrorSVG } from '@assets/svg';
import { flexMixins } from '@src/styles';

export const ErrorFallback: React.FC = memo(() => {
    const { t } = useTranslation();

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
                <ErrorSVG />
                <Typography variant="h3" component="h1" fontWeight="bold">
                    {t('errors.oops')}
                </Typography>
                <Typography variant="h5" component="h2" color="text.secondary">
                    {t('errors.somethingWentWrong')}
                </Typography>
            </Box>
        </Container>
    );
});

ErrorFallback.displayName = 'ErrorFallback';
