import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import styles from './styles.module.less';
import { Header } from '../header';
import { Sidebar } from '../sidebar';

export const AppLayout: React.FC = () => {
    return (
        <Box className={styles.wrapper}>
            <Box className={styles.header}>
                <Header />
            </Box>
            <Box className={styles.sidebar}>
                <Sidebar />
            </Box>
            <Box className={styles.main} component="main">
                <Outlet />
            </Box>
        </Box>
    );
};
