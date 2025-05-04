import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import { ROUTES } from './routes';
import { AppLayout } from '@components/layout';
import { Projects } from '@pages/projects';
import { Workspace } from '@pages/workspace';
import { TestRuns } from '@pages/test-runs';
import { ProtectedRoute } from '@context/auth/ProtectedRoute';
import { ProjectRepository } from '@pages/project-repository';
import { TestPlanDetails, TestPlans } from '@pages/test-plans';
import { LandingPage } from '@pages/landing';

// Root route doesn't specify a component, it will just be an outlet
const rootRoute = createRootRoute();

// Public landing route
const landingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
});

// Protected routes container
const appLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'app-layout',
    component: AppLayout,
});

const protectedRoute = createRoute({
    getParentRoute: () => appLayoutRoute,
    id: 'protected',
    component: ProtectedRoute,
});

const projectsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.PROJECTS}`,
    component: Projects,
});

const projectRepositoryRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.PROJECT}/$projectId`,
    component: ProjectRepository,
});

const workspaceRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.WORKSPACE}`,
    component: Workspace,
});

const testPlansRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.TEST_PLANS}/$projectId`,
    component: TestPlans,
});

const testPlanDetailsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.TEST_PLANS}/$projectId/$testPlanId`,
    component: TestPlanDetails,
});

const testRunsRoute = createRoute({
    getParentRoute: () => protectedRoute,
    path: `/${ROUTES.TEST_RUNS}/$projectId`,
    component: TestRuns,
});

const routeTree = rootRoute.addChildren([
    landingRoute,
    appLayoutRoute.addChildren([
        protectedRoute.addChildren([
            projectsRoute,
            projectRepositoryRoute,
            workspaceRoute,
            testRunsRoute,
            testPlansRoute,
            testPlanDetailsRoute,
        ]),
    ]),
]);

export const router = createRouter({ routeTree });
