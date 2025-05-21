import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import { ROUTES } from './routes';
import { AppLayout } from '@components/layout';
import { Projects } from '@pages/projects';
import { Workspace } from '@pages/workspace';
import { TestRuns } from '@pages/test-runs';
import { ProjectRepository } from '@pages/project-repository';
import { TestPlanDetails, TestPlans } from '@pages/test-plans';
import { LandingPage } from '@pages/landing';
import { CreateOrganization } from '@pages/create-organization';
import { ProtectedRoute } from '@context/auth';
import { PublicRoute } from '@context/auth';
import { PageNotFound } from '@components/errors';

const rootRoute = createRootRoute({
    notFoundComponent: PageNotFound,
});

const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: PublicRoute,
    path: '/',
});

const landingRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTES.LANDING,
    component: LandingPage,
});

const createOrganizationRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: ROUTES.CREATE_ORGANIZATION,
    component: CreateOrganization,
});

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
    publicLayoutRoute.addChildren([landingRoute, createOrganizationRoute]),
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
