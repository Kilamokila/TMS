import { z } from 'zod';
import { nameSchema, descriptionSchema } from '@schemas/common';
import { OrganizationRequestDto } from '@services/api/models';

// Схема валидации для формы создания организации
export const organizationSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Для преобразования данных формы в DTO запроса
export const mapFormToOrganizationRequest = (formData: OrganizationFormData): OrganizationRequestDto => {
    return {
        name: formData.name,
        description: formData.description || undefined,
    };
};
