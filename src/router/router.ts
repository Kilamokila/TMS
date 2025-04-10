import { createRootRoute, createRouter, createRoute, redirect } from '@tanstack/react-router';
import { ROUTES } from './routes';
import { AppLayout } from '@components/layout';
import { Projects } from '@pages/projects';
import { Workspace } from '@pages/workspace';
import { TestRuns } from '@pages/test-runs';
import { ProtectedRoute } from '@context/auth/ProtectedRoute';
import { ProjectRepository } from '@pages/project-repository';
import { TestPlanDetails, TestPlans } from '@pages/test-plans';

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

const projectRepositoryRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `${ROUTES.PROJECT}/$projectId`,
    component: ProjectRepository,
});

const workspaceRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: ROUTES.WORKSPACE,
    component: Workspace,
});

// Изменяем на path-параметр вместо query-параметра
const testPlansRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `${ROUTES.TEST_PLANS}/$projectId`,
    component: TestPlans,
});

// Обновляем путь, добавляя projectId для согласованности
const testPlanDetailsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `${ROUTES.TEST_PLANS}/$projectId/$testPlanId`,
    component: TestPlanDetails,
});

// Изменяем на path-параметр вместо query-параметра
const testRunsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `${ROUTES.TEST_RUNS}/$projectId`,
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
    protectedRoute.addChildren([
        projectsRoute,
        projectRepositoryRoute,
        workspaceRoute,
        testRunsRoute,
        testPlansRoute,
        testPlanDetailsRoute,
    ]),
]);

export const router = createRouter({ routeTree });
