import { z } from 'zod';
import {
    titleSchema,
    descriptionSchema,
    shortDescriptionSchema,
    testCasePrioritySchema,
    testCaseStatusSchema,
    idSchema,
    actionSchema,
    expectedResultSchema,
} from './common';
import { TestCaseRequestDto, TestStepRequestDto } from '@services/api/models/testCase';

// Схема для шага тестового сценария
export const testStepSchema = z.object({
    id: idSchema.optional(),
    orderNumber: z.number().int().positive(),
    action: actionSchema,
    expectedResult: expectedResultSchema,
});

export type TestStepFormData = z.infer<typeof testStepSchema>;

// Схема для тестового сценария
export const testCaseSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    preConditions: shortDescriptionSchema,
    postConditions: shortDescriptionSchema,
    testCasePriority: testCasePrioritySchema,
    testCaseStatus: testCaseStatusSchema,
    testSteps: z.array(testStepSchema).default([]),
});

export type TestCaseFormData = z.infer<typeof testCaseSchema>;

// Функция для преобразования данных формы в запрос API для тестового сценария
export const mapFormToTestCaseRequest = (formData: TestCaseFormData, userId: number): TestCaseRequestDto => {
    return {
        title: formData.title,
        description: formData.description || undefined,
        preConditions: formData.preConditions || undefined,
        postConditions: formData.postConditions || undefined,
        testCasePriority: formData.testCasePriority,
        testCaseStatus: formData.testCaseStatus,
        createdBy: userId,
        updatedBy: userId,
    };
};

// Функция для преобразования данных формы в запрос API для шагов тестового сценария
export const mapFormToTestStepRequests = (steps: TestStepFormData[]): TestStepRequestDto[] => {
    return steps.map((step, index) => ({
        orderNumber: index + 1, // Гарантируем правильный порядок
        action: step.action,
        expectedResult: step.expectedResult || undefined,
    }));
};
