import { z } from 'zod';
import { TestPlanRequestDto, TestPlanStatus } from '@services/api/models/testPlans';

// Схема валидации для формы тестового плана
export const testPlanSchema = z.object({
    name: z
        .string({
            required_error: 'validation.required',
            invalid_type_error: 'validation.invalidType',
        })
        .min(1, { message: 'validation.required' })
        .max(200, { message: 'validation.maxLength' }),
    description: z.string().max(2000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
    status: z.nativeEnum(TestPlanStatus, {
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    }),
    createdBy: z.number().int().positive(),
});

// Тип данных формы тестового плана
export type TestPlanFormData = z.infer<typeof testPlanSchema>;

// Преобразование данных формы в запрос API
export const mapFormToRequest = (formData: TestPlanFormData): TestPlanRequestDto => {
    return {
        name: formData.name,
        description: formData.description || undefined,
        status: formData.status,
        createdBy: formData.createdBy,
    };
};

// Схема валидации для порядка тест-кейсов
export const testCaseOrderSchema = z.object({
    testCaseId: z.number().int().positive(),
    orderNumber: z.number().int().min(1),
});

export type TestCaseOrderData = z.infer<typeof testCaseOrderSchema>;

// Схема валидации для выбора тест-кейсов
export const testCaseSelectionSchema = z.array(z.number().int().positive());

export type TestCaseSelectionData = z.infer<typeof testCaseSelectionSchema>;
