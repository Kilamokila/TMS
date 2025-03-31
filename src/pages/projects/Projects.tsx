// src/pages/projects/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Box, TablePagination, Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ProjectWithStats, mapProjectToUI, ProjectResponseDto } from '@services/api/models';

import { ProjectsToolbar } from './components/ProjectsToolbar';
import { ProjectsTable } from './components/ProjectsTable';
import { ProjectsGrid } from './components/ProjectsGrid';
import { EditProjectDialog } from './components/EditProjectDialog';
import { DeleteProjectDialog } from './components/DeleteProjectDialog';
import { ProjectFormData, mapFormToRequest } from './schema';
import {
    useCreateProjectMutation,
    useGetProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    getErrorMessage,
} from '@services/api/rtkQuery';

export const Projects: React.FC = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Состояния для модальных окон
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectResponseDto | undefined>(undefined);

    // Состояние для меню
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // Состояние для уведомлений
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // RTK Query хуки
    const {
        data: projectsPage,
        isLoading,
        error: fetchError,
    } = useGetProjectsQuery({
        page,
        size: pageSize,
        sort: [`${sortField},${sortDirection}`],
    });

    const [createProject, { isLoading: isCreating, error: createError }] = useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating, error: updateError }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting, error: deleteError }] = useDeleteProjectMutation();

    // Обработка ошибок RTK Query
    useEffect(() => {
        if (fetchError) {
            showNotification(getErrorMessage(fetchError), 'error');
        }
    }, [fetchError]);

    // Мапим проекты для UI
    const projects: ProjectWithStats[] = projectsPage?.content.map(mapProjectToUI) || [];

    // Показать уведомление
    const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    // Обработчики для пагинации
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Обработчики для поиска и фильтрации
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        // TODO: Реализовать поиск через API
    };

    // Обработчик сортировки
    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
    };

    // Обработчики для модальных окон
    const handleOpenCreateDialog = () => {
        setSelectedProject(undefined);
        setIsCreateDialogOpen(true);
    };

    const handleOpenEditDialog = () => {
        setIsEditDialogOpen(true);
    };

    const handleOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    // Обработчики для меню
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: number) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedProjectId(projectId);

        // Находим проект по ID
        const project = projects.find((p) => p.id === projectId);

        if (project) {
            setSelectedProject(project);
        }
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // Обработчики для CRUD операций
    const handleCreateProject = async (data: ProjectFormData) => {
        try {
            const requestData = mapFormToRequest(data);

            await createProject(requestData).unwrap();
            setIsCreateDialogOpen(false);
            showNotification(t('projects.projectCreated'), 'success');
        } catch (error) {
            console.error('Failed to create project:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleUpdateProject = async (data: ProjectFormData) => {
        if (!selectedProject) return;

        try {
            const requestData = mapFormToRequest(data);

            await updateProject({ id: selectedProject.id, data: requestData }).unwrap();
            setIsEditDialogOpen(false);
            showNotification(t('projects.projectUpdated'), 'success');
        } catch (error) {
            console.error('Failed to update project:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    const handleDeleteProject = async () => {
        if (!selectedProject) return;

        try {
            await deleteProject(selectedProject.id).unwrap();
            setIsDeleteDialogOpen(false);
            showNotification(t('projects.projectDeleted'), 'success');
        } catch (error) {
            console.error('Failed to delete project:', error);
            showNotification(getErrorMessage(error), 'error');
        }
    };

    // Обработчик для переключения режима отображения
    const handleToggleView = () => {
        setViewMode(viewMode === 'list' ? 'grid' : 'list');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            {/* Панель инструментов */}
            <ProjectsToolbar
                onCreateProject={handleOpenCreateDialog}
                onToggleView={handleToggleView}
                viewMode={viewMode}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onAddFilter={() => {
                    /* TODO: Реализовать фильтрацию */
                }}
                filtersCount={0}
            />

            {/* Отображение проектов в зависимости от выбранного режима */}
            {viewMode === 'list' ? (
                <ProjectsTable
                    projects={projects}
                    isLoading={isLoading}
                    onMenuOpen={handleMenuOpen}
                    onSort={handleSort}
                    sortField={sortField}
                    sortDirection={sortDirection}
                />
            ) : (
                <ProjectsGrid projects={projects} isLoading={isLoading} onMenuOpen={handleMenuOpen} />
            )}

            {/* Пагинация */}
            <TablePagination
                component="div"
                count={projectsPage?.totalElements || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={t('projects.rowsPerPage')}
            />

            {/* Меню действий для проекта */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        handleOpenEditDialog();
                    }}
                >
                    {t('common.edit')}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        handleOpenDeleteDialog();
                    }}
                >
                    {t('common.delete')}
                </MenuItem>
            </Menu>

            {/* Диалоги для создания, редактирования и удаления проектов */}
            <EditProjectDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateProject}
                isSubmitting={isCreating}
                error={createError ? getErrorMessage(createError) : undefined}
            />

            <EditProjectDialog
                open={isEditDialogOpen}
                project={selectedProject}
                onClose={() => setIsEditDialogOpen(false)}
                onSubmit={handleUpdateProject}
                isSubmitting={isUpdating}
                error={updateError ? getErrorMessage(updateError) : undefined}
            />

            <DeleteProjectDialog
                open={isDeleteDialogOpen}
                projectName={selectedProject?.name}
                isDeleting={isDeleting}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteProject}
                error={deleteError ? getErrorMessage(deleteError) : undefined}
            />

            {/* Уведомления */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
