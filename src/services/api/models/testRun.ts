// Статусы тестового запуска
export type TestRunStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

// Статусы результата тестового запуска
export type TestRunResultStatus = 'PASSED' | 'FAILED' | 'BLOCKED' | 'SKIPPED';

// DTO для создания тестового запуска
export interface TestRunRequestDto {
    testPlanId: number;
    name: string;
    createdBy: number;
    assignedToUserId?: number;
}

// DTO для результата тестового запуска
export interface TestRunResultResponseDto {
    testRunId: number;
    testCaseId: number;
    status: TestRunResultStatus;
    notes?: string;
    executedAt?: string; // date-time в формате ISO
}

// DTO для ответа с тестовым запуском
export interface TestRunResponseDto {
    id: number;
    testPlan: number;
    name: string;
    status: TestRunStatus;
    startDate?: string; // date-time в формате ISO
    endDate?: string; // date-time в формате ISO
    createdBy: number;
    assignedTo?: number;
    testRunResults: TestRunResultResponseDto[];
}

// DTO для обновления результата тест-кейса
export interface TestRunResultUpdateRequestDto {
    status: TestRunResultStatus;
    notes?: string;
}

// DTO для ответа при обновлении результата тест-кейса
export interface UpdateTestCaseResultInTestRunDto {
    testRunResult: TestRunResultResponseDto;
    testRunStatus: TestRunStatus;
}

// Вспомогательные функции для работы с моделями

// Расчет статистики тестового запуска
export const calculateTestRunStats = (testRunResults: TestRunResultResponseDto[]) => {
    const stats = {
        total: testRunResults.length,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
    };

    testRunResults.forEach((result) => {
        switch (result.status) {
            case 'PASSED':
                stats.passed++;
                break;
            case 'FAILED':
                stats.failed++;
                break;
            case 'BLOCKED':
                stats.blocked++;
                break;
            case 'SKIPPED':
                stats.skipped++;
                break;
        }
    });

    return stats;
};

// Конвертация API статусов в локальные статусы для UI
export const mapTestRunStatusToUiStatus = (status: TestRunStatus): string => {
    switch (status) {
        case 'NOT_STARTED':
            return 'inProgress'; // В нашем UI используется такой статус
        case 'IN_PROGRESS':
            return 'inProgress';
        case 'COMPLETED':
            return 'passed'; // Можно решить, какой статус использовать для завершенных прогонов
        default:
            return 'inProgress';
    }
};

// Конвертация API статусов результата в локальные статусы для UI
export const mapTestRunResultStatusToUiStatus = (status: TestRunResultStatus): string => {
    switch (status) {
        case 'PASSED':
            return 'passed';
        case 'FAILED':
            return 'failed';
        case 'BLOCKED':
            return 'blocked';
        case 'SKIPPED':
            return 'skipped';
        default:
            return 'skipped';
    }
};
