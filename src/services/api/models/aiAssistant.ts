import { TestStepResponseDto } from './testCase';

export interface AITestSuite {
    description: string;
    name: string;
    testCases: TestCase[];
}

export type TestCase = {
    name: string;
    priority: string;
    steps: TestStepResponseDto[];
};
