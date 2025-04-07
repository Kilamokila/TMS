import React, { MouseEvent } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Typography,
    Box,
    IconButton,
    Skeleton,
    useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ProjectWithStats } from '../model/project';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@router/routes';

interface ProjectsTableProps {
    projects: ProjectWithStats[];
    isLoading: boolean;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>, projectId: number) => void;
    onSort?: (field: string, direction: 'asc' | 'desc') => void;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
    projects,
    isLoading,
    onMenuOpen,
    onSort,
    sortField = 'name',
    sortDirection = 'asc',
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLDivElement>, project: ProjectWithStats) => {
        navigate({ to: `/${ROUTES.PROJECT}/$projectId`, params: { projectId: project.id } });
    };

    const handleSortRequest = (field: string) => {
        if (onSort) {
            const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

            onSort(field, direction);
        }
    };

    const renderSortLabel = (field: string, label: string) => {
        // Если нет функции сортировки - просто выводим текст
        if (!onSort) return label;

        return (
            <TableSortLabel
                active={sortField === field}
                direction={sortField === field ? sortDirection : 'asc'}
                onClick={() => handleSortRequest(field)}
            >
                {label}
            </TableSortLabel>
        );
    };

    // Скелетон для загрузки
    if (isLoading) {
        return (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('projects.projectName')}</TableCell>
                            <TableCell>{t('projects.testRuns')}</TableCell>
                            <TableCell>{t('projects.teamMembers')}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Skeleton
                                            variant="rectangular"
                                            width={40}
                                            height={40}
                                            sx={{ borderRadius: 1 }}
                                        />
                                        <Box ml={2} width="100%">
                                            <Skeleton variant="text" width="60%" />
                                            <Skeleton variant="text" width="80%" />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={80} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="circular" width={24} height={24} />
                                </TableCell>
                                <TableCell align="right">
                                    <Skeleton variant="circular" width={28} height={28} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{renderSortLabel('name', t('projects.projectName'))}</TableCell>
                        <TableCell>{t('projects.testRuns')}</TableCell>
                        <TableCell>{t('projects.teamMembers')}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow
                            component="tr"
                            onClick={(event) => handleClick(event, project)}
                            key={project.id}
                            hover
                        >
                            <TableCell>
                                <Box display="flex" alignItems="center">
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
                                    <Box ml={2}>
                                        <Typography variant="subtitle1">{project.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {t('projects.testCasesCount', { count: project.testCases || 0 })} |{' '}
                                            {t('projects.suitesCount', { count: project.suites || 0 })} |{' '}
                                            {t('projects.activeRunsCount', { count: project.activeRuns || 0 })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {project.testRuns || 0} {t('projects.testRuns').toLowerCase()}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {project.projectUsers && project.projectUsers.length > 0 ? (
                                    <Box sx={{ display: 'flex' }}>
                                        {[...Array(Math.min(3, project.projectUsers.length))].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor: theme.palette.primary.main,
                                                    color: theme.palette.primary.contrastText,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    marginLeft: index > 0 ? '-8px' : 0,
                                                    border: `1px solid ${theme.palette.background.paper}`,
                                                    zIndex: 10 - index,
                                                }}
                                            >
                                                U{index + 1}
                                            </Box>
                                        ))}
                                        {project.projectUsers.length > 3 && (
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor: theme.palette.grey[300],
                                                    color: theme.palette.text.secondary,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    marginLeft: '-8px',
                                                    border: `1px solid ${theme.palette.background.paper}`,
                                                }}
                                            >
                                                +{project.projectUsers.length - 3}
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        {t('projects.noMembers')}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={(event) => onMenuOpen(event, project.id)}
                                    aria-label={t('projects.actionsForProject', { name: project.name })}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {projects.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="textSecondary">
                                    {t('projects.noProjectsFound')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
