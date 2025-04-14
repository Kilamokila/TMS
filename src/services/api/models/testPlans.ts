import { TestCaseResponseDto } from './testCase';

// Перечисления для статуса тестового плана
export enum TestPlanStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

// Модель запроса для создания/обновления тестового плана
export interface TestPlanRequestDto {
    name: string;
    description?: string;
    status: TestPlanStatus;
    createdBy: number;
}

// Модель ответа для тестового плана
export interface TestPlanResponseDto {
    id: number;
    name: string;
    description?: string;
    status: TestPlanStatus;
    createdAt: string;
    updatedAt: string;
    projectId: number;
    createdById: number;
}

// Модель запроса для добавления/изменения порядка тест-кейсов в плане
export interface TestPlanTestCaseRequestDto {
    testCaseId: number;
    orderNumber: number;
}

// Модель ответа для тест-кейса в тестовом плане
export interface TestPlanTestCaseResponseDto {
    id: number;
    testCaseId: number;
    orderNumber: number;
}

// Расширенная модель для UI с дополнительной информацией
export interface TestPlanWithStats extends TestPlanResponseDto {
    testCasesCount: number;
    testCases?: TestCaseResponseDto[];
}

// Параметры запроса для фильтрации тестовых планов
export interface TestPlansQueryParams {
    projectId: number;
    status?: TestPlanStatus;
    name?: string;
}

// Преобразователь данных API для UI
export const mapTestPlanToUI = (testPlan: TestPlanResponseDto, testCasesCount = 0): TestPlanWithStats => {
    return {
        ...testPlan,
        testCasesCount,
    };
};
