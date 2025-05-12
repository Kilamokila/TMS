import { ZodError, ZodIssue, z } from 'zod';
import { useTranslation } from 'react-i18next';

/**
 * Преобразует ошибки Zod в формат, понятный пользователю
 */
export const formatZodErrors = (
    error: ZodError,
    t: (key: string, options?: Record<string, unknown>) => string,
    fieldLabels?: Record<string, string>,
): Record<string, string[]> => {
    const errors: Record<string, string[]> = {};

    error.issues.forEach((issue: ZodIssue) => {
        const path = issue.path.join('.');
        const fieldName = path || 'root';

        // Получаем человекочитаемое название поля, если оно предоставлено
        const fieldLabel = fieldLabels?.[fieldName] || fieldName;

        // Форматируем сообщение об ошибке в зависимости от типа ошибки
        let message: string;

        switch (issue.code) {
            case 'invalid_type':
                if (issue.received === 'undefined' || issue.received === 'null') {
                    message = t('validation.required', { field: fieldLabel });
                } else {
                    message = t('validation.invalidType', { field: fieldLabel, expected: issue.expected });
                }

                break;

            case 'too_small':
                if (issue.type === 'string') {
                    message = t('validation.minLength', { field: fieldLabel, count: issue.minimum });
                } else {
                    message = t('validation.tooSmall', { field: fieldLabel, min: issue.minimum });
                }

                break;

            case 'too_big':
                if (issue.type === 'string') {
                    message = t('validation.maxLength', { field: fieldLabel, count: issue.maximum });
                } else {
                    message = t('validation.tooBig', { field: fieldLabel, max: issue.maximum });
                }

                break;

            case 'invalid_string':
                switch (issue.validation) {
                    case 'email':
                        message = t('validation.invalidEmail', { field: fieldLabel });
                        break;
                    case 'url':
                        message = t('validation.invalidUrl', { field: fieldLabel });
                        break;
                    case 'uuid':
                        message = t('validation.invalidUuid', { field: fieldLabel });
                        break;
                    case 'datetime':
                        message = t('validation.invalidDate', { field: fieldLabel });
                        break;
                    default:
                        message = t('validation.invalidString', { field: fieldLabel });
                }

                break;

            case 'invalid_enum_value':
                message = t('validation.invalidOption', {
                    field: fieldLabel,
                    options: issue.options.join(', '),
                });
                break;

            case 'invalid_arguments':
                message = t('validation.invalidArguments', { field: fieldLabel });
                break;

            case 'custom':
                // Пользовательское сообщение об ошибке, переданное через .refine() или .superRefine()
                if (typeof issue.message === 'string' && issue.message.startsWith('validation.')) {
                    message = t(issue.message, { field: fieldLabel });
                } else {
                    message = issue.message || t('validation.invalidField', { field: fieldLabel });
                }

                break;

            default:
                message = issue.message || t('validation.invalidField', { field: fieldLabel });
        }

        if (!errors[fieldName]) {
            errors[fieldName] = [];
        }

        errors[fieldName].push(message);
    });

    return errors;
};

/**
 * Хук для форматирования ошибок валидации
 */
export const useZodErrorFormatter = () => {
    const { t } = useTranslation();

    return (error: ZodError, fieldLabels?: Record<string, string>): Record<string, string[]> => {
        return formatZodErrors(error, t, fieldLabels);
    };
};

export function createUniqueFieldSchema<T extends z.ZodType<unknown, z.ZodTypeDef>>(
    baseSchema: T,
    isUniqueFunc: (value: z.infer<T>) => Promise<boolean>,
    errorMessage: string,
): z.ZodEffects<T> {
    return baseSchema.superRefine(async (value, ctx) => {
        const isUnique = await isUniqueFunc(value);

        if (!isUnique) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: errorMessage,
            });

            return z.NEVER;
        }

        return value;
    });
}

/**
 * Создает динамическую схему для частичного обновления модели
 * с сохранением валидации
 */
export const createPartialSchema = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
    return schema.partial();
};
