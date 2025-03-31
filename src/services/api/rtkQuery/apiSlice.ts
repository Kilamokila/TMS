// src/services/api/rtkQuery/apiSlice.ts
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ApiError } from '../models';

// Базовый URL API
const BASE_URL = 'http://147.45.245.28:31433/api/v1';

// Базовый API клиент
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            // Здесь можно добавить авторизацию и другие общие заголовки
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            headers.set('Content-Type', 'application/json');

            return headers;
        },
        // Обработка сетевых ошибок
        validateStatus: (response) => {
            if (!response.ok) {
                // Дополнительная логика обработки HTTP ошибок
                console.error(`API Error: ${response.status} ${response.statusText}`);
            }

            return response.ok;
        },
    }),
    // Определение всех типов тегов для кэширования
    tagTypes: ['Project', 'User', 'Organization', 'TestPlan', 'TestCase', 'TestRun'],
    endpoints: () => ({}),
});

// Утилиты для обработки ошибок
export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === 'object' && error != null && 'status' in error;
};

export const isApiError = (error: unknown): error is ApiError => {
    return (
        isFetchBaseQueryError(error) && typeof error.data === 'object' && error.data !== null && 'message' in error.data
    );
};

export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.data.message;
    }

    if (isFetchBaseQueryError(error)) {
        return `Ошибка сервера: ${error.status}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Произошла неизвестная ошибка';
};

export const getFieldErrors = (error: unknown): Record<string, string[]> | undefined => {
    if (isApiError(error) && error.data.errors) {
        return error.data.errors;
    }

    return undefined;
};
