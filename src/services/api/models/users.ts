// src/services/api/models/users.ts
import { Page } from './common';

// Модели запросов
export interface UserRequestDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    active: boolean;
}

// Модели ответов
export interface UserResponseDto {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    active: boolean;
    registrationDate: string;
    lastLoginDate?: string;
    organizations: number[];
    projects: number[];
}

// Тип страницы с пользователями
export type PageUserResponseDto = Page<UserResponseDto>;

// Параметры запроса пользователей с дополнительными фильтрами
export interface UsersQueryParams {
    page?: number;
    size?: number;
    sort?: string[];
    email?: string;
    active?: boolean;
}
