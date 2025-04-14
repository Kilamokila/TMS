export const ROUTES = {
    PROJECTS: 'projects',
    PROJECT: 'project',
    WORKSPACE: 'workspace',
    TEST_RUNS: 'test-runs',
    TEST_PLANS: 'test-plans',
} as const;

export const ROUTES_WITH_SIDEBAR = [ROUTES.WORKSPACE, ROUTES.TEST_RUNS, ROUTES.PROJECT, ROUTES.TEST_PLANS];
