import React from 'react';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    RadioGroupProps,
} from '@mui/material';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FormRadioGroupProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<RadioGroupProps, 'name'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: string;
    options: RadioOption[];
    required?: boolean;
    helperText?: string;
    formatError?: (error: FieldError) => string;
    disabled: boolean;
}

export function FormRadioGroup<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    label,
    options,
    required = false,
    helperText,
    formatError,
    row,
    disabled,
    ...radioGroupProps
}: FormRadioGroupProps<TFieldValues>): React.ReactElement {
    const { t } = useTranslation();

    // Стандартная функция форматирования ошибок
    const defaultFormatError = (error: FieldError): string => {
        if (!error) return '';

        // Обработка различных типов ошибок
        if (error.type === 'required') {
            return t('validation.required', { field: label });
        }

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
                <FormControl
                    fullWidth
                    error={!!fieldState.error}
                    required={required}
                    component="fieldset"
                    disabled={disabled}
                >
                    {label && <FormLabel component="legend">{label}</FormLabel>}

                    <RadioGroup
                        {...radioGroupProps}
                        {...field}
                        row={row}
                        value={field.value ?? ''}
                        onChange={(e) => {
                            field.onChange(e);

                            if (radioGroupProps.onChange) {
                                radioGroupProps.onChange(e, e.target.value);
                            }
                        }}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                                disabled={option.disabled}
                            />
                        ))}
                    </RadioGroup>

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
