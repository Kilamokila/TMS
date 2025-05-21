import React from 'react';
import { Grid2 } from '@mui/material';
import { ProjectResponseDto } from '@services/api/models/projects';
import { ProjectCard } from '../items/ProjectCard';

interface ProjectGridProps {
    projects: ProjectResponseDto[];
    onEdit: (project: ProjectResponseDto) => void;
    onDelete: (project: ProjectResponseDto) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onEdit, onDelete }) => {
    return (
        <Grid2 container spacing={3}>
            {projects.map((project) => (
                <Grid2 key={project.id} size={{ xs: 12, md: 4, sm: 6, lg: 3 }}>
                    <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
                </Grid2>
            ))}
        </Grid2>
    );
};
