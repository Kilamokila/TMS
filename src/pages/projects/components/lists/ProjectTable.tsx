import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { ProjectResponseDto } from '@services/api/models/projects';
import { ProjectTableRow } from './ProjectTableRow';

interface ProjectTableProps {
    projects: ProjectResponseDto[];
    sortField: string;
    sortDirection: 'asc' | 'desc';
    onSortChange: (field: string) => void;
    onEdit: (project: ProjectResponseDto) => void;
    onDelete: (project: ProjectResponseDto) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
    projects,
    sortField,
    sortDirection,
    onSortChange,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();

    const handleSortClick = useCallback(
        (field: string) => () => {
            onSortChange(field);
        },
        [onSortChange],
    );

    return (
        <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="projects table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortField === 'name'}
                                direction={sortDirection}
                                onClick={handleSortClick('name')}
                            >
                                {t('projects.projectName')}
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>{t('projects.teamMembers')}</TableCell>
                        <TableCell>{t('projects.createdAt')}</TableCell>
                        <TableCell align="right">{t('testCases.columns.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((project) => (
                        <ProjectTableRow key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
