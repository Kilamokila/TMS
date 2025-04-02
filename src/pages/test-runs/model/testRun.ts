export interface TestRun {
    id: string;
    title: string;
    description?: string;
    status: TestRunStatus;
    author: {
        id: string;
        name: string;
        avatar?: string;
    };
    environment: string;
    totalTime: number; // в секундах
    elapsedTime: number; // в секундах
    startedAt: string;
    stats: TestRunStats;
}

export type TestRunStatus = 'inProgress' | 'passed' | 'failed' | 'blocked' | 'invalid';

export interface TestRunStats {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
    invalid: number;
}

// Mock данные для демонстрации
export const MOCK_TEST_RUNS: TestRun[] = [
    {
        id: '1',
        title: 'Test run 2025/03/19',
        status: 'inProgress',
        author: {
            id: '1',
            name: 'Roman 777',
        },
        environment: 'Example env',
        totalTime: 0,
        elapsedTime: 0,
        startedAt: '2025-03-14T10:00:00Z', // 5 дней назад от даты на скриншоте
        stats: {
            total: 4,
            passed: 1,
            failed: 1,
            blocked: 0,
            skipped: 1,
            invalid: 1,
        },
    },
];
