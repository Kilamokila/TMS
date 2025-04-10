import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
    Collapse,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useGetProjectByIdQuery } from '@services/api/rtkQuery';
import { ROUTES } from '@router/routes';

interface ProjectSidebarContentProps {
    projectId: string;
}

export const ProjectSidebarContent: React.FC<ProjectSidebarContentProps> = ({ projectId }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const numericProjectId = parseInt(projectId, 10);

    // Состояние для разделов меню
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        tests: true,
        execution: true,
    });

    // Получение данных о проекте
    const {
        data: project,
        isLoading,
        error,
    } = useGetProjectByIdQuery(numericProjectId, {
        skip: isNaN(numericProjectId),
    });

    const handleSectionToggle = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    // Улучшенная проверка активного пути
    const isActive = (path: string) => location.pathname === path;

    // Если проект загружается или произошла ошибка
    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary">
                    {t('common.loading')}
                </Typography>
            </Box>
        );
    }

    if (error || !project) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="error">
                    {t('project.errorLoadingProject')}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Заголовок проекта в верхней части сайдбара */}
            <Box sx={{ p: 2, pb: 0 }}>
                <Typography variant="h6" noWrap>
                    {project.name}
                </Typography>
                <Typography variant="caption" color="textSecondary" noWrap>
                    {project.code}
                </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Раздел "Тесты" */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSectionToggle('tests')}>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.08em',
                                    }}
                                >
                                    {t('sidebar.tests')}
                                </Typography>
                            }
                        />
                        {openSections.tests ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={openSections.tests} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={`/${ROUTES.PROJECT}/${projectId}`}
                                sx={{
                                    pl: 4,
                                    bgcolor: isActive(`/${ROUTES.PROJECT}/${projectId}`)
                                        ? 'action.selected'
                                        : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <FolderIcon
                                        color={isActive(`/${ROUTES.PROJECT}/${projectId}`) ? 'primary' : 'inherit'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('sidebar.repository')}
                                    sx={{
                                        color: isActive(`/${ROUTES.PROJECT}/${projectId}`) ? 'primary.main' : 'inherit',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Collapse>
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Раздел "Выполнение" */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSectionToggle('execution')}>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.08em',
                                    }}
                                >
                                    {t('sidebar.execution')}
                                </Typography>
                            }
                        />
                        {openSections.execution ? (
                            <ExpandLessIcon fontSize="small" />
                        ) : (
                            <ExpandMoreIcon fontSize="small" />
                        )}
                    </ListItemButton>
                </ListItem>

                <Collapse in={openSections.execution} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {/* Тестовые планы - обновленная ссылка с path-параметрами */}
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={`/${ROUTES.TEST_PLANS}/${projectId}`}
                                sx={{
                                    pl: 4,
                                    bgcolor: isActive(`/${ROUTES.TEST_PLANS}/${projectId}`)
                                        ? 'action.selected'
                                        : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <AssignmentIcon
                                        color={isActive(`/${ROUTES.TEST_PLANS}/${projectId}`) ? 'primary' : 'inherit'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('sidebar.testPlans')}
                                    sx={{
                                        color: isActive(`/${ROUTES.TEST_PLANS}/${projectId}`)
                                            ? 'primary.main'
                                            : 'inherit',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>

                        {/* Тестовые прогоны - обновленная ссылка с path-параметрами */}
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={`/${ROUTES.TEST_RUNS}/${projectId}`}
                                sx={{
                                    pl: 4,
                                    bgcolor: isActive(`/${ROUTES.TEST_RUNS}/${projectId}`)
                                        ? 'action.selected'
                                        : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <PlayArrowIcon
                                        color={isActive(`/${ROUTES.TEST_RUNS}/${projectId}`) ? 'primary' : 'inherit'}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={t('sidebar.testRuns')}
                                    sx={{
                                        color: isActive(`/${ROUTES.TEST_RUNS}/${projectId}`)
                                            ? 'primary.main'
                                            : 'inherit',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </>
    );
};
