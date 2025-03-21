// src/pages/projects/Projects.tsx
import React, { useEffect, useState } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Paper,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    Card,
    CardContent,
    Grid2,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import { RootState } from '@store/index';
// import { fetchProjects, setCurrentPage, setPageSize, createProject } from '@store/slices/projectsSlice';
// import { AppDispatch } from '@store/index';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { ProjectFormData } from './schema';

// Временные данные для демонстрации, пока не подключен API
const TEMP_PROJECTS = [
    {
        id: '1',
        name: 'Demo Project',
        code: 'DP',
        description: 'Demo project for testing',
        organizationId: '1',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
        testCases: 11,
        suites: 4,
        activeRuns: 1,
        unresolved: 2,
        testRuns: 2,
        milestones: 2,
    },
];

export const Projects: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    //const dispatch = useDispatch<AppDispatch>();
    //const { projects, loading, totalPages, currentPage, pageSize } = useSelector((state: RootState) => state.projects);

    // Временное решение пока не подключен API
    const projects = TEMP_PROJECTS;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const loading = false;
    const totalPages = 1;
    const currentPage = 0;
    const pageSize = 10;

    const [searchValue, setSearchValue] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(
        () => {
            // Временно закомментировано, пока не подключен Redux и API
            //dispatch(fetchProjects({ page: currentPage, size: pageSize }));
        },
        [
            /*dispatch, currentPage, pageSize*/
        ],
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleChangePage = (_event: unknown, newPage: number) => {
        //dispatch(setCurrentPage(newPage));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        //dispatch(setPageSize(parseInt(event.target.value, 10)));
        //dispatch(setCurrentPage(0));
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedProjectId(projectId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProjectId(null);
    };

    const handleCreateProject = () => {
        setCreateDialogOpen(true);
    };

    const handleProjectSubmit = async (data: ProjectFormData) => {
        setIsSubmitting(true);

        try {
            // Симуляция задержки запроса
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Project data:', data);
            // Когда будет готов API:
            // await dispatch(createProject(data)).unwrap();
            setCreateDialogOpen(false);
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderTable = () => (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t('projects.projectName')}</TableCell>
                        <TableCell>{t('projects.unresolvedDefects')}</TableCell>
                        <TableCell>{t('projects.testRuns')}</TableCell>
                        <TableCell>{t('projects.milestones')}</TableCell>
                        <TableCell>{t('projects.teamMembers')}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id}>
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
                                        {project.code}
                                    </Box>
                                    <Box ml={2}>
                                        <Typography variant="subtitle1">{project.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {t('projects.testCasesCount', { count: project.testCases })} |{' '}
                                            {t('projects.suitesCount', { count: project.suites })} |{' '}
                                            {t('projects.activeRunsCount', { count: project.activeRuns })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                {project.unresolved > 0 ? (
                                    <Chip
                                        icon={<WarningAmberIcon />}
                                        label={t('projects.openIssues', { count: project.unresolved })}
                                        color="warning"
                                        size="small"
                                        variant="outlined"
                                    />
                                ) : (
                                    '0 issues'
                                )}
                            </TableCell>
                            <TableCell>
                                {project.testRuns} {t('projects.testRuns').toLowerCase()}
                            </TableCell>
                            <TableCell>
                                {project.milestones} {t('projects.milestones').toLowerCase()}
                            </TableCell>
                            <TableCell>
                                {/* В будущем здесь будут аватары пользователей */}
                                <Box
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
                                    }}
                                >
                                    K
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton size="small" onClick={(event) => handleMenuOpen(event, project.id)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderCards = () => (
        <Grid2 container spacing={2}>
            {projects.map((project) => (
                <Grid2 size={{ xs: 12, md: 4, sm: 6 }} key={project.id}>
                    <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
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
                                    {project.code}
                                </Box>
                                <Box ml={2} sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1">{project.name}</Typography>
                                </Box>
                                <IconButton size="small" onClick={(event) => handleMenuOpen(event, project.id)}>
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>

                            <Typography variant="body2" color="textSecondary" mb={2}>
                                {t('projects.testCasesCount', { count: project.testCases })} |{' '}
                                {t('projects.suitesCount', { count: project.suites })} |{' '}
                                {t('projects.activeRunsCount', { count: project.activeRuns })}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                {project.unresolved > 0 ? (
                                    <Chip
                                        icon={<WarningAmberIcon />}
                                        label={t('projects.openIssues', { count: project.unresolved })}
                                        color="warning"
                                        size="small"
                                        variant="outlined"
                                    />
                                ) : (
                                    <Chip label="0 issues" size="small" variant="outlined" />
                                )}

                                <Typography variant="body2">
                                    {project.testRuns} {t('projects.testRuns').toLowerCase()} | {project.milestones}{' '}
                                    {t('projects.milestones').toLowerCase()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('projects.title')}
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateProject}>
                    {t('projects.createNewProject')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <TextField
                    placeholder={t('projects.searchProjects')}
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2d3748',
                        p: '8px 16px',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2" component="span">
                        {t('projects.statusActive')}
                    </Typography>
                    <Button color="primary" size="small" sx={{ ml: 1 }}>
                        {t('projects.addFilter')}
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    <IconButton color={viewMode === 'list' ? 'primary' : 'default'} onClick={() => setViewMode('list')}>
                        <ViewListIcon />
                    </IconButton>
                    <IconButton color={viewMode === 'grid' ? 'primary' : 'default'} onClick={() => setViewMode('grid')}>
                        <ViewModuleIcon />
                    </IconButton>
                </Box>
            </Box>

            {viewMode === 'list' ? renderTable() : renderCards()}

            <TablePagination
                component="div"
                count={totalPages * pageSize}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={t('projects.rowsPerPage')}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>{t('common.edit')}</MenuItem>
                <MenuItem onClick={handleMenuClose}>{t('common.delete')}</MenuItem>
            </Menu>

            <CreateProjectDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSubmit={handleProjectSubmit}
                isSubmitting={isSubmitting}
            />
        </Box>
    );
};
