import { createRootRoute, createRouter, createRoute, redirect } from '@tanstack/react-router';
import { ROUTES } from './routes';
import { AppLayout } from '@components/layout';
import { Projects } from '@pages/projects';
import { Workspace } from '@pages/workspace';
import { TestRuns } from '@pages/test-runs';
import { ProtectedRoute } from '@context/auth/ProtectedRoute';

const rootRoute = createRootRoute({
    component: AppLayout,
});

const protectedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protected',
    component: ProtectedRoute,
});

const projectsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: ROUTES.PROJECTS,
    component: Projects,
});

const workspaceRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: ROUTES.WORKSPACE,
    component: Workspace,
});

const testRunsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: ROUTES.TEST_RUNS,
    component: TestRuns,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({
            to: `/${ROUTES.PROJECTS}`,
        });
    },
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    protectedRoute.addChildren([projectsRoute, workspaceRoute, testRunsRoute]),
]);

export const router = createRouter({ routeTree });
