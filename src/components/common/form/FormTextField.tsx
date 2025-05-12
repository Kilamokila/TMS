import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface FormTextFieldProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<TextFieldProps, 'name'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    required?: boolean;
    helperText?: string;
    formatError?: (error: FieldError) => string;
    multiline?: boolean;
    rows?: number;
}

export function FormTextField<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    required = false,
    helperText,
    formatError,
    multiline = false,
    rows,
    ...textFieldProps
}: FormTextFieldProps<TFieldValues>): React.ReactElement {
    const { t } = useTranslation();

    // Стандартная функция форматирования ошибок
    const defaultFormatError = (error: FieldError): string => {
        if (!error) return '';

        // Обработка различных типов ошибок
        if (error.type === 'required') {
            return t('validation.required', { field: textFieldProps.label });
        }

        if (error.type === 'minLength') {
            return t('validation.minLength', {
                field: textFieldProps.label,
                count: error.message ? parseInt(error.message) : 0,
            });
        }

        if (error.type === 'maxLength') {
            return t('validation.maxLength', {
                field: textFieldProps.label,
                count: error.message ? parseInt(error.message) : 0,
            });
        }

        if (error.type === 'pattern') {
            return t('validation.pattern', { field: textFieldProps.label });
        }

        // Если ошибка пришла из Zod
        if (typeof error.message === 'string') {
            return error.message;
        }

        return t('validation.invalid', { field: textFieldProps.label });
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    {...textFieldProps}
                    required={required}
                    multiline={multiline}
                    rows={rows}
                    value={field.value || ''}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? (formatError || defaultFormatError)(fieldState.error) : helperText}
                    onChange={(e) => {
                        field.onChange(e);

                        if (textFieldProps.onChange) {
                            textFieldProps.onChange(e);
                        }
                    }}
                    onBlur={(e) => {
                        field.onBlur();

                        if (textFieldProps.onBlur) {
                            textFieldProps.onBlur(e);
                        }
                    }}
                />
            )}
        />
    );
}
