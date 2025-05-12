import React from 'react';
import { FormControlLabel, Checkbox, FormHelperText, FormControl, CheckboxProps } from '@mui/material';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues> extends Omit<CheckboxProps, 'name'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: string;
    helperText?: string;
    formatError?: (error: FieldError) => string;
}

export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    label,
    helperText,
    formatError,
    ...checkboxProps
}: FormCheckboxProps<TFieldValues>): React.ReactElement {
    const { t } = useTranslation();

    // Стандартная функция форматирования ошибок
    const defaultFormatError = (error: FieldError): string => {
        if (!error) return '';

        // Если ошибка пришла из Zod
        if (typeof error.message === 'string') {
            return error.message;
        }

        return t('validation.invalid', { field: label });
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                {...checkboxProps}
                                checked={!!field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.checked);

                                    if (checkboxProps.onChange) {
                                        checkboxProps.onChange(e, e.target.checked);
                                    }
                                }}
                                onBlur={field.onBlur}
                                disabled={checkboxProps.disabled}
                            />
                        }
                        label={label}
                    />

                    {(fieldState.error || helperText) && (
                        <FormHelperText>
                            {fieldState.error ? (formatError || defaultFormatError)(fieldState.error) : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}
