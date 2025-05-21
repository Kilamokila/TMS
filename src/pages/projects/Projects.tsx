import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, Container, Grid2 } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGetProjectsQuery } from '@services/api/rtkQuery/queries/projectsApi';
import { ProjectResponseDto } from '@services/api/models/projects';
import { LoadingSplash } from '@components/common/loader';
import { useProjectParams } from './hooks/useProjectParams';
import { TViewMode, useProjectsView, VIEW_MODE } from './hooks/useProjectsView';
import { useDialog } from '@hooks/useDialog';
import { Pagination, SearchInput, ViewToggleButtons } from './components/items';
import { ProjectEmptyState, ProjectGrid, ProjectTable } from './components/lists';
import { CreateProjectDialog, DeleteProjectConfirmation, EditProjectDialog } from './components/dialogs';

export const Projects: React.FC = () => {
    const { t } = useTranslation();
    const { viewMode, setTableView, setGridView } = useProjectsView();
    const { params, searchTerm, setSearchTerm, clearSearch, sortState, updateSort, setPage, setPageSize } =
        useProjectParams();

    // Данные для модальных окон
    const [selectedProject, setSelectedProject] = useState<ProjectResponseDto | null>(null);

    // Хуки для управления модальными окнами
    const createDialog = useDialog();
    const editDialog = useDialog();
    const deleteDialog = useDialog();

    // Запрос на получение проектов
    const { data, isLoading } = useGetProjectsQuery(params);
    const projects = useMemo(() => data?.content || [], [data]);
    const isLoadingProjects = isLoading;

    // Временно используем 1 в качестве organizationId для создания проекта
    const organizationId = 1;

    // Обработчики для модальных окон
    const handleCreateProjectClick = useCallback(() => {
        createDialog.openDialog({
            type: 'create',
            title: t('projects.createNewProject'),
        });
    }, [createDialog, t]);

    const handleEditProjectClick = useCallback(
        (project: ProjectResponseDto) => {
            setSelectedProject(project);
            editDialog.openDialog({
                type: 'edit',
                title: t('projects.editProject'),
            });
        },
        [editDialog, t],
    );

    const handleDeleteProjectClick = useCallback(
        (project: ProjectResponseDto) => {
            setSelectedProject(project);
            deleteDialog.openDialog({
                type: 'delete',
                title: t('projects.deleteProject'),
            });
        },
        [deleteDialog, t],
    );

    // Обработчик изменения режима просмотра
    const handleViewModeChange = useCallback(
        (mode: TViewMode) => {
            if (mode === VIEW_MODE.TABLE) {
                setTableView();
            } else {
                setGridView();
            }
        },
        [setTableView, setGridView],
    );

    // Если загрузка, показываем индикатор загрузки
    if (isLoadingProjects) {
        return <LoadingSplash />;
    }

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            {projects.length !== 0 && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 0 }}>
                        <Typography variant="h4" component="h1">
                            {t('projects.title')}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateProjectClick}
                        >
                            {t('projects.createNewProject')}
                        </Button>
                    </Box>

                    <Grid2 container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid2 size={{ xs: 12, md: 4, sm: 6 }}>
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onClear={clearSearch}
                                placeholder={t('projects.searchProjects')}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4, sm: 6 }}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                                <ViewToggleButtons viewMode={viewMode} onViewChange={handleViewModeChange} />
                            </Box>
                        </Grid2>
                    </Grid2>
                </Box>
            )}

            {projects.length === 0 ? (
                <ProjectEmptyState onCreateProjectClick={handleCreateProjectClick} />
            ) : (
                <Box>
                    {viewMode === VIEW_MODE.TABLE ? (
                        <ProjectTable
                            projects={projects}
                            sortField={sortState.field}
                            sortDirection={sortState.direction}
                            onSortChange={updateSort}
                            onEdit={handleEditProjectClick}
                            onDelete={handleDeleteProjectClick}
                        />
                    ) : (
                        <ProjectGrid
                            projects={projects}
                            onEdit={handleEditProjectClick}
                            onDelete={handleDeleteProjectClick}
                        />
                    )}

                    {data && (
                        <Pagination
                            page={params.page}
                            pageSize={params.size}
                            totalPages={data.totalPages}
                            totalElements={data.totalElements}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    )}
                </Box>
            )}

            {/* Диалоги */}
            <CreateProjectDialog
                open={createDialog.dialog.open}
                onClose={createDialog.closeDialog}
                organizationId={organizationId}
            />

            <EditProjectDialog
                open={editDialog.dialog.open}
                onClose={editDialog.closeDialog}
                project={selectedProject}
            />

            <DeleteProjectConfirmation
                open={deleteDialog.dialog.open}
                onClose={deleteDialog.closeDialog}
                project={selectedProject}
            />
        </Container>
    );
};
