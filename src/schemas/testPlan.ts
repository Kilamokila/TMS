import { z } from 'zod';
import { titleSchema, descriptionSchema, testPlanStatusSchema, idSchema } from './common';
import { TestPlanRequestDto, TestPlanStatus } from '@services/api/models/testPlans';

// Схема для формы тестового плана
export const testPlanSchema = z.object({
    name: titleSchema,
    description: descriptionSchema,
    status: testPlanStatusSchema,
    createdBy: idSchema,
});

export type TestPlanFormData = z.infer<typeof testPlanSchema>;

const statusMap: Record<TestPlanFormData['status'], TestPlanStatus> = {
    DRAFT: TestPlanStatus.DRAFT,
    ACTIVE: TestPlanStatus.ACTIVE,
    COMPLETED: TestPlanStatus.COMPLETED,
};

// Преобразование данных формы в запрос API
export const mapFormToTestPlanRequest = (formData: TestPlanFormData): TestPlanRequestDto => {
    return {
        name: formData.name,
        description: formData.description || undefined,
        status: statusMap[formData.status],
        createdBy: formData.createdBy,
    };
};

// Схема для порядка тест-кейсов
export const testCaseOrderSchema = z.object({
    testCaseId: idSchema,
    orderNumber: z.number().int().min(1),
});

export type TestCaseOrderData = z.infer<typeof testCaseOrderSchema>;

// Схема для выбора тест-кейсов
export const testCaseSelectionSchema = z.array(idSchema);

export type TestCaseSelectionData = z.infer<typeof testCaseSelectionSchema>;
