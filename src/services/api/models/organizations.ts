import { Page } from './common';
import { ProjectResponseDto } from './projects';

// Модели запросов
export interface OrganizationRequestDto {
    name: string;
    description?: string;
}

// Модели ответов
export interface UserOrganizationDto {
    userId: number;
    organizationId: number;
    joinDate: string;
}

export interface OrganizationResponseDto {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    projects: ProjectResponseDto[];
    userOrganizations: UserOrganizationDto[];
}

// Тип страницы с организациями
export type PageOrganizationResponseDto = Page<OrganizationResponseDto>;

// Параметры запроса организаций с дополнительными фильтрами
export interface OrganizationsQueryParams {
    page?: number;
    size?: number;
    sort?: string[];
    name?: string;
}
