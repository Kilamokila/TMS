export interface TestStepRequestDto {
    orderNumber: number;
    action: string;
    expectedResult?: string;
}

export interface TestStepResponseDto {
    id: number;
    orderNumber: number;
    action: string;
    expectedResult?: string;
}

export interface TestCaseRequestDto {
    title: string;
    description?: string;
    preConditions?: string;
    postConditions?: string;
    testCasePriority: 'LOW' | 'MEDIUM' | 'HIGH';
    testCaseStatus: 'DRAFT' | 'ACTIVE' | 'DEPRECATED';
    createdBy: number;
    updatedBy: number;
    testSuiteId?: number;
}

export interface TestCaseResponseDto {
    id: number;
    title: string;
    description?: string;
    preConditions?: string;
    postConditions?: string;
    testCasePriority: 'LOW' | 'MEDIUM' | 'HIGH';
    testCaseStatus: 'DRAFT' | 'ACTIVE' | 'DEPRECATED';
    projectId: number;
    createdBy: number;
    updatedBy: number;
    testSteps: TestStepResponseDto[];
}
