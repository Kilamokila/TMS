import React, { useCallback } from 'react';
import { TableRow, TableCell, Avatar, Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ROUTES } from '@router/routes';
import { ProjectResponseDto } from '@services/api/models/projects';
import { ProjectActionsMenu } from '../items/ProjectActionsMenu';
import { useTranslation } from 'react-i18next';

interface ProjectTableRowProps {
    project: ProjectResponseDto;
    onEdit: (project: ProjectResponseDto) => void;
    onDelete: (project: ProjectResponseDto) => void;
}

export const ProjectTableRow: React.FC<ProjectTableRowProps> = ({ project, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();
    const handleRowClick = useCallback(() => {
        navigate({ to: `/${ROUTES.PROJECT}/$projectId`, params: { projectId: project.id } });
    }, [navigate, project.id]);

    const formattedDate = format(new Date(project.createdAt), 'dd.MM.yyyy HH:mm');

    return (
        <TableRow
            hover
            onClick={handleRowClick}
            sx={{
                cursor: 'pointer',
                '&:last-child td, &:last-child th': { border: 0 },
            }}
        >
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                            mr: 2,
                            fontSize: '1rem',
                        }}
                    >
                        {project.code.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" component="div">
                            {project.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {project.code}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>

            <TableCell>
                {project.projectUsers.length > 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        {t('projects.teamMembersCount')} {project.projectUsers.length}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        {t('projects.noMembers')}
                    </Typography>
                )}
            </TableCell>

            <TableCell>
                <Typography variant="body2">{formattedDate}</Typography>
            </TableCell>

            <TableCell align="right">
                <ProjectActionsMenu project={project} onEdit={onEdit} onDelete={onDelete} />
            </TableCell>
        </TableRow>
    );
};
