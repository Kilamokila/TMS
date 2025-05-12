import { z } from 'zod';
import { nameSchema, codeSchema, descriptionSchema, idSchema } from './common';
import { ProjectRequestDto } from '@services/api/models/projects';

// Схема для формы создания/редактирования проекта
export const projectSchema = z.object({
    name: nameSchema,
    code: codeSchema,
    description: descriptionSchema,
    organizationId: idSchema,
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Функция для преобразования данных формы в DTO запроса
export const mapFormToProjectRequest = (formData: ProjectFormData): ProjectRequestDto => {
    return {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        organizationId: formData.organizationId,
    };
};

// Схема для формы проекта без кода (для редактирования)
export const projectEditSchema = projectSchema.omit({ code: true });

export type ProjectEditFormData = z.infer<typeof projectEditSchema>;

// Схема для поиска проектов
export const projectSearchSchema = z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    organizationId: z.number().optional(),
});

export type ProjectSearchParams = z.infer<typeof projectSearchSchema>;
