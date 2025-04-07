export const ROUTES = {
    PROJECTS: 'projects',
    PROJECT: 'project',
    WORKSPACE: 'workspace',
    TEST_RUNS: 'test-runs',
} as const;

export const ROUTES_WITH_SIDEBAR = [ROUTES.WORKSPACE, ROUTES.TEST_RUNS, ROUTES.PROJECT];
