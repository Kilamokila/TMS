import { Page } from './common';

export interface ProjectRequestDto {
    name: string;
    description?: string;
    code: string;
    organizationId: number;
}

export interface ProjectUserDto {
    projectId: number;
    userId: number;
    joinDate: string;
}

export interface ProjectResponseDto {
    id: number;
    organizationId: number;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    projectUsers: ProjectUserDto[];
}

export type PageProjectResponseDto = Page<ProjectResponseDto>;

export interface ProjectsQueryParams {
    page?: number;
    size?: number;
    sort?: string[];
    name?: string;
    code?: string;
    organizationId?: number;
}

export interface ProjectWithStats extends ProjectResponseDto {
    testCases?: number;
    suites?: number;
    activeRuns?: number;
    unresolved?: number;
    testRuns?: number;
}

export const mapProjectToUI = (project: ProjectResponseDto): ProjectWithStats => {
    return {
        ...project,
        testCases: 0, // Заглушки для демо
        suites: 0,
        activeRuns: 0,
        unresolved: 0,
        testRuns: 0,
    };
};
