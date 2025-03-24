import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import { ROUTES } from './routes';
import { AppLayout } from '@components/layout';
import { Projects } from '@pages/projects';
import { Workspace } from '@pages/workspace';
import { TestRuns } from '@pages/test-runs';

const rootRoute = createRootRoute({
    component: AppLayout,
});

const projectsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.PROJECTS,
    component: Projects,
});

const workspaceRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.WORKSPACE,
    component: Workspace,
});

const testRunsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTES.TEST_RUNS,
    component: TestRuns,
});

const routeTree = rootRoute.addChildren([projectsRoute, workspaceRoute, testRunsRoute]);

export const router = createRouter({ routeTree });
