// src/services/api/models/projects.ts
import { Page } from './common';

// Модели запросов
export interface ProjectRequestDto {
    name: string;
    description?: string;
    code: string;
    organizationId: number;
}

// Модели ответов
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

// Тип страницы с проектами
export type PageProjectResponseDto = Page<ProjectResponseDto>;

// Параметры запроса проектов с дополнительными фильтрами
export interface ProjectsQueryParams {
    page?: number;
    size?: number;
    sort?: string[];
    name?: string;
    code?: string;
    organizationId?: number;
}

// Расширенный тип проекта для UI
export interface ProjectWithStats extends ProjectResponseDto {
    testCases?: number;
    suites?: number;
    activeRuns?: number;
    unresolved?: number;
    testRuns?: number;
}

// Преобразователь данных API для UI
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
