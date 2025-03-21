import { Project } from '@pages/projects/model/project';

interface ProjectsResponse {
    content: Project[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const projectService = {
    getProjects: async (page = 0, size = 10, sort?: string): Promise<ProjectsResponse> => {
        try {
            const response = await fetch(`/api/projects?page=${page}&size=${size}${sort ? `&sort=${sort}` : ''}`);

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    getProject: async (id: string): Promise<Project> => {
        try {
            const response = await fetch(`/api/projects/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch project');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    },

    createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    },

    deleteProject: async (id: string): Promise<void> => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },
};
