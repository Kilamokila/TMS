import { Box } from '@mui/material';
import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import styles from './styles.module.less';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { ROUTES } from '@router/routes';

export const AppLayout: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname.substring(1).split('/')[0]; // Получаем первый сегмент пути

    // Показываем сайдбар только для Workspace (Пространство)
    const showSidebar = currentPath === ROUTES.WORKSPACE || currentPath === ROUTES.TEST_RUNS;

    return (
        <Box className={`${styles.wrapper} ${!showSidebar ? styles.withoutSidebar : ''}`}>
            <Box className={styles.header}>
                <Header />
            </Box>
            {showSidebar && (
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
