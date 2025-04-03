export const ROUTES = {
    PROJECTS: 'projects',
    WORKSPACE: 'workspace',
    TEST_RUNS: 'test-runs',
} as const;

// Обновляем список маршрутов с сайдбаром, исключаем PROJECTS
export const ROUTES_WITH_SIDEBAR = [ROUTES.WORKSPACE, ROUTES.TEST_RUNS];
