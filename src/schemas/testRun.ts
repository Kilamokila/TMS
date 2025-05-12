import { z } from 'zod';
import { titleSchema, descriptionSchema, idSchema, testRunResultStatusSchema } from './common';
import { TestRunRequestDto, TestRunResultUpdateRequestDto } from '@services/api/models/testRun';

// Схема для формы создания тестового запуска
export const testRunSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    testPlanId: idSchema,
    defaultAssignee: idSchema.optional().nullable(),
    environment: z.string().optional(),
});

export type TestRunFormData = z.infer<typeof testRunSchema>;

// Преобразование данных формы в запрос API
export const mapFormToTestRunRequest = (formData: TestRunFormData, userId: number): TestRunRequestDto => {
    return {
        name: formData.title,
        testPlanId: formData.testPlanId,
        createdBy: userId,
        assignedToUserId: formData.defaultAssignee || undefined,
    };
};

// Схема для формы обновления статуса тест-кейса в запуске
export const testRunResultUpdateSchema = z.object({
    status: testRunResultStatusSchema,
    notes: z.string().max(1000).optional(),
});

export type TestRunResultUpdateFormData = z.infer<typeof testRunResultUpdateSchema>;

// Преобразование данных формы в запрос API
export const mapFormToTestRunResultUpdateRequest = (
    formData: TestRunResultUpdateFormData,
): TestRunResultUpdateRequestDto => {
    return {
        status: formData.status,
        notes: formData.notes || undefined,
    };
};
