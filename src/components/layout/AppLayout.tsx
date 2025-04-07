import { Box } from '@mui/material';
import React from 'react';
import { Outlet, useLocation, useParams } from '@tanstack/react-router';
import styles from './styles.module.less';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { ROUTES } from '@router/routes';
import { ProjectSidebarContent } from '@pages/project-repository/components/ProjectSidebarContent';

export const AppLayout: React.FC = () => {
    const location = useLocation();
    const { projectId } = useParams({ strict: false });
    const currentPath = location.pathname.substring(1).split('/')[0]; // Получаем первый сегмент пути

    const showSidebar =
        currentPath === ROUTES.WORKSPACE || currentPath === ROUTES.TEST_RUNS || currentPath === ROUTES.PROJECT;

    // Определяем содержимое сайдбара в зависимости от пути
    const renderSidebarContent = () => {
        if (currentPath === ROUTES.PROJECT && projectId) {
            return <ProjectSidebarContent projectId={projectId} />;
        }

        // Для других путей можно добавить другое содержимое
        return null;
    };

    return (
        <Box className={`${styles.wrapper} ${!showSidebar ? styles.withoutSidebar : ''}`}>
            <Box className={styles.header}>
                <Header />
            </Box>
            {showSidebar && (
                <Box className={styles.sidebar}>
                    <Sidebar>{renderSidebarContent()}</Sidebar>
                </Box>
            )}
            <Box className={styles.main} component="main">
                <Outlet />
            </Box>
        </Box>
    );
};
