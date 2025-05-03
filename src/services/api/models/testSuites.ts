import { Page } from './common';

// Модели ответов
export interface TestSuiteResponseDto {
    id: number;
    name: string;
    description?: string;
    preConditions?: string;
    createdAt: string;
    updatedAt: string;
    projectId: number;
    testCaseIds: number[];
}

// Тип страницы с тест-сюитами
export type PageTestSuiteResponseDto = Page<TestSuiteResponseDto>;
