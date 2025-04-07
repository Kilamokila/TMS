import React, { MouseEvent } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Skeleton, useTheme, Grid2 } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProjectWithStats } from '../model/project';
import { ROUTES } from '@router/routes';
import { useNavigate } from '@tanstack/react-router';

interface ProjectsGridProps {
    projects: ProjectWithStats[];
    isLoading: boolean;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>, projectId: number) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, isLoading, onMenuOpen }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLDivElement>, project: ProjectWithStats) => {
        navigate({ to: `/${ROUTES.PROJECT}/$projectId`, params: { projectId: project.id } });
    };

    // Скелетон для загрузки
    if (isLoading) {
        return (
            <Grid2 container spacing={3}>
                {[...Array(6)].map((_, index) => (
                    <Grid2 size={{ xs: 12, md: 4, sm: 6 }} key={index}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                                    <Box ml={2} width="100%">
                                        <Skeleton variant="text" width="70%" />
                                    </Box>
                                    <Skeleton variant="circular" width={28} height={28} />
                                </Box>
                                <Skeleton variant="text" width="100%" />
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        );
    }

    // Если нет проектов
    if (projects.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="textSecondary">
                    {t('projects.noProjectsFound')}
                </Typography>
            </Box>
        );
    }

    return (
        <Grid2 container spacing={3}>
            {projects.map((project) => (
                <Grid2 size={{ xs: 12, md: 4, sm: 6 }} key={project.id}>
                    <Card
                        component="div"
                        onClick={(event) => handleClick(event, project)}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: theme.palette.primary.light,
                                        color: theme.palette.primary.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 1,
                                        fontWeight: 500,
                                    }}
                                >
                                    {project.code.substring(0, 2).toUpperCase()}
                                </Box>
                                <Box ml={2} flexGrow={1}>
                                    <Typography variant="subtitle1" component="h3" noWrap>
                                        {project.name}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={(event) => onMenuOpen(event, project.id)}
                                    aria-label={t('projects.actionsForProject', { name: project.name })}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Typography variant="body2" color="textSecondary" mb={2}>
                                {t('projects.testCasesCount', { count: project.testCases || 0 })} |{' '}
                                {t('projects.suitesCount', { count: project.suites || 0 })} |{' '}
                                {t('projects.activeRunsCount', { count: project.activeRuns || 0 })}
                            </Typography>

                            <Box mt="auto">
                                <Box display="flex" justifyContent="flex-end" alignItems="center">
                                    <Typography variant="body2" color="textSecondary">
                                        {project.testRuns || 0} {t('projects.testRuns').toLowerCase()}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
};
