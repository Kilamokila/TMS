import React from 'react';
import { Box, useTheme } from '@mui/material';
import styles from './styles.module.less';
import { CommitLogoSVG } from '@assets/svg';

export const LoadingSplash: React.FC = () => {
    const theme = useTheme();

    return (
        <Box className={styles.loadingContainer} sx={{ bgcolor: theme.palette.background.default }}>
            <Box className={styles.loadingContent}>
                <Box className={styles.logoWrapper}>
                    <CommitLogoSVG className={styles.logo} />
                    <Box className={styles.pulseRing} />
                    <Box className={styles.pulseRing2} />
                </Box>
            </Box>
        </Box>
    );
};
