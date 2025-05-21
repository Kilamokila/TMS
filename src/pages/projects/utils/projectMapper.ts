import { format } from 'date-fns';
import { ProjectResponseDto } from '@services/api/models/projects';

/**
 * Интерфейс для проекта, адаптированного для UI
 */
export interface UIProject {
    id: number;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    formattedCreatedAt: string;
    organizationId: number;
    membersCount: number;
    members: Array<{
        userId: number;
        joinDate: string;
    }>;
}

export const mapProjectToUI = (project: ProjectResponseDto): UIProject => {
    const createdDate = new Date(project.createdAt);
    const formattedCreatedAt = format(createdDate, 'dd.MM.yyyy HH:mm');

    return {
        id: project.id,
        name: project.name,
        code: project.code,
        description: project.description,
        createdAt: project.createdAt,
        formattedCreatedAt,
        organizationId: project.organizationId,
        membersCount: project.projectUsers.length,
        members: project.projectUsers.map((user) => ({
            userId: user.userId,
            joinDate: user.joinDate,
        })),
    };
};

export const formatProjectDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);

        return format(date, 'dd.MM.yyyy HH:mm');
    } catch (error) {
        console.error('Error formatting date:', error);

        return dateString;
    }
};

export const sortProjectsByName = (projects: UIProject[], direction: 'asc' | 'desc' = 'asc'): UIProject[] => {
    return [...projects].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (direction === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });
};
