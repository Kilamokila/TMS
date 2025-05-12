import { z } from 'zod';

/**
 * Базовые схемы валидации, используемые в разных частях приложения
 */

// Правила для строковых полей с различными длинами
export const nameSchema = z
    .string({
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    })
    .min(1, { message: 'validation.required' })
    .max(100, { message: 'validation.maxLength' });

export const titleSchema = z
    .string({
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    })
    .min(1, { message: 'validation.required' })
    .max(200, { message: 'validation.maxLength' });

export const codeSchema = z
    .string({
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    })
    .min(1, { message: 'validation.required' })
    .max(16, { message: 'validation.maxLength' })
    .regex(/^[A-Za-z0-9_-]+$/, { message: 'validation.pattern' });

export const descriptionSchema = z.string().max(2000, { message: 'validation.maxLength' }).optional().or(z.literal(''));

export const shortDescriptionSchema = z
    .string()
    .max(1000, { message: 'validation.maxLength' })
    .optional()
    .or(z.literal(''));

export const actionSchema = z
    .string({
        required_error: 'validation.required',
        invalid_type_error: 'validation.invalidType',
    })
    .min(1, { message: 'validation.required' })
    .max(1000, { message: 'validation.maxLength' });

export const expectedResultSchema = z
    .string()
    .max(1000, { message: 'validation.maxLength' })
    .optional()
    .or(z.literal(''));

// Схемы для идентификаторов
export const idSchema = z.number().int().positive();
export const optionalIdSchema = z.number().int().positive().optional();

// Схемы для дат
export const dateSchema = z.string().datetime({ offset: true });
export const optionalDateSchema = z.string().datetime({ offset: true }).optional();

// Схемы для перечислений
export const testCasePrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'validation.required',
    invalid_type_error: 'validation.invalidType',
});

export const testCaseStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED'], {
    required_error: 'validation.required',
    invalid_type_error: 'validation.invalidType',
});

export const testPlanStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'COMPLETED'], {
    required_error: 'validation.required',
    invalid_type_error: 'validation.invalidType',
});

export const testRunStatusSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
    required_error: 'validation.required',
    invalid_type_error: 'validation.invalidType',
});

export const testRunResultStatusSchema = z.enum(['PASSED', 'FAILED', 'BLOCKED', 'SKIPPED'], {
    required_error: 'validation.required',
    invalid_type_error: 'validation.invalidType',
});

// Функция для создания nullable-схемы
export const nullable = <T extends z.ZodTypeAny>(schema: T) => {
    return schema.nullable().transform((val) => (val === null ? undefined : val));
};

// Функция для создания optional-схемы
export const optional = <T extends z.ZodTypeAny>(schema: T) => {
    return schema.optional();
};
