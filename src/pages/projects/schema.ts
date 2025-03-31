import { z } from 'zod';
import { ProjectRequestDto } from '@services/api/models';

// Схема валидации формы для создания/обновления проекта
export const projectSchema = z.object({
    name: z
        .string({
            required_error: 'validation.required',
            invalid_type_error: 'validation.invalidType',
        })
        .min(1, { message: 'validation.required' })
        .max(100, { message: 'validation.maxLength' }),
    code: z
        .string({
            required_error: 'validation.required',
            invalid_type_error: 'validation.invalidType',
        })
        .min(1, { message: 'validation.required' })
        .max(16, { message: 'validation.maxLength' })
        .regex(/^[A-Za-z0-9_-]+$/, { message: 'validation.pattern' }),
    description: z.string().max(1000, { message: 'validation.maxLength' }).optional().or(z.literal('')),
    organizationId: z.coerce.number().int().positive(),
});

// Тип данных формы
export type ProjectFormData = z.infer<typeof projectSchema>;

// Преобразование формы в запрос API
export const mapFormToRequest = (formData: ProjectFormData): ProjectRequestDto => {
    return {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        organizationId: formData.organizationId,
    };
};
