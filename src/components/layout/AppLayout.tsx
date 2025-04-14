import { Box } from '@mui/material';
import React from 'react';
import { Outlet, useLocation, useParams } from '@tanstack/react-router';
import styles from './styles.module.less';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { ROUTES_WITH_SIDEBAR } from '@router/routes';
import { ProjectSidebarContent } from '@pages/project-repository/components/ProjectSidebarContent';
import { ErrorBoundary } from 'react-error-boundary';

export const AppLayout: React.FC = () => {
    const location = useLocation();
    const { projectId } = useParams({ strict: false });

    const currentPath = location.pathname.substring(1).split('/')[0] as
        | 'project'
        | 'workspace'
        | 'test-runs'
        | 'test-plans';

    const showSidebar = ROUTES_WITH_SIDEBAR.includes(currentPath);

    const renderSidebarContent = () => {
        if (showSidebar) {
            return <ProjectSidebarContent projectId={projectId} />;
        }
        //TODO: Для других путей

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
            <ErrorBoundary fallback={<div>Что-то пошло не так</div>}>
                <Box className={styles.main} component="main">
                    <Outlet />
                </Box>
            </ErrorBoundary>
        </Box>
    );
};
