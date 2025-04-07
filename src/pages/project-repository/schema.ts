import { z } from 'zod';
import { TestCaseRequestDto, TestStepRequestDto } from '@services/api/models';

// Схема валидации для шага тестового сценария
export const testStepSchema = z.object({
    id: z.number().optional(), // Добавляем id как опциональное поле
    orderNumber: z.number().int().positive(),
    action: z
        .string({
            required_error: 'validation.required',
            invalid_type_error: 'validation.invalidType',
        })
        .min(1, { message: 'validation.required' })
        .max(1000, { message: 'validation.maxLength' }),
    expectedResult: z.string().max(1000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
});

// Схема валидации для тестового сценария
export const testCaseSchema = z.object({
    title: z
        .string({
            required_error: 'validation.required',
            invalid_type_error: 'validation.invalidType',
        })
        .min(1, { message: 'validation.required' })
        .max(200, { message: 'validation.maxLength' }),
    description: z.string().max(2000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
    preConditions: z.string().max(1000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
    postConditions: z.string().max(1000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
    testCasePriority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    }),
    testCaseStatus: z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED'], {
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    }),
    testSteps: z.array(testStepSchema).default([]),
});

// Типы данных из схем
export type TestStepFormData = z.infer<typeof testStepSchema>;
export type TestCaseFormData = z.infer<typeof testCaseSchema>;

// Преобразование данных формы в запрос API
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

// Преобразование данных формы в запрос API для шагов
export const mapFormToTestStepRequests = (steps: TestStepFormData[]): TestStepRequestDto[] => {
    return steps.map((step, index) => ({
        orderNumber: index + 1, // Гарантируем правильный порядок
        action: step.action,
        expectedResult: step.expectedResult || undefined,
    }));
};
