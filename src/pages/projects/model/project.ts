export interface Project {
    id: string;
    name: string;
    code: string;
    description: string;
    organizationId: string;
    createdAt: string;
    updatedAt: string;
    users?: User[];
    testCases?: number;
    suites?: number;
    activeRuns?: number;
    unresolved?: number;
    testRuns?: number;
    milestones?: number;
}

export interface User {
    id: string;
    name: string;
    avatar?: string;
}
