import { Box } from '@mui/material';
import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';

import styles from './styles.module.less';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { ROUTES_WITH_SIDEBAR } from '@router/routes';

export const AppLayout: React.FC = () => {
    const { pathname } = useLocation();

    const shouldRenderSidebar = ROUTES_WITH_SIDEBAR.some((path) => pathname.includes(path));

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.header}>
                <Header />
            </Box>
            {shouldRenderSidebar && (
                <Box className={styles.sidebar}>
                    <Sidebar />
                </Box>
            )}
            <Box className={styles.main} component="main">
                <Outlet />
            </Box>
        </Box>
    );
};
