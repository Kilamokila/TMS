import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, Box, Avatar, Chip, CardActionArea } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@router/routes';
import { ProjectResponseDto } from '@services/api/models/projects';
import { ProjectActionsMenu } from './ProjectActionsMenu';

interface ProjectCardProps {
    project: ProjectResponseDto;
    onEdit: (project: ProjectResponseDto) => void;
    onDelete: (project: ProjectResponseDto) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCardClick = useCallback(() => {
        navigate({ to: `/${ROUTES.PROJECT}/$projectId`, params: { projectId: project.id } });
    }, [navigate, project.id]);

    const formattedDate = format(new Date(project.createdAt), 'dd.MM.yyyy');

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <ProjectActionsMenu project={project} onEdit={onEdit} onDelete={onDelete} />
            </Box>

            <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1 }}>
                <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 48,
                                height: 48,
                                mr: 2,
                                fontSize: '1.2rem',
                            }}
                        >
                            {project.code.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" component="div" noWrap>
                                {project.name}
                            </Typography>
                            <Chip label={project.code} size="small" sx={{ mt: 0.5 }} />
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                        {project.description ? (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {project.description}
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                {t('projects.noDescription')}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            {t('projects.createdAt')} {formattedDate}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            {project.projectUsers.length > 0 ? (
                                <Typography variant="caption" color="text.secondary">
                                    {t('projects.teamMembersCount')} {project.projectUsers.length}
                                </Typography>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    {t('projects.noMembers')}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
