import React from 'react';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    SelectProps,
    SelectChangeEvent,
} from '@mui/material';
import { Controller, Control, FieldValues, Path, FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface FormSelectProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<SelectProps, 'name' | 'value' | 'onChange'> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    required?: boolean;
    helperText?: string;
    options: SelectOption[];
    formatError?: (error: FieldError) => string;
    showEmptyOption?: boolean;
    emptyOptionText?: string;
    onChange?: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    required = false,
    label,
    helperText,
    options,
    formatError,
    showEmptyOption = false,
    emptyOptionText,
    ...selectProps
}: FormSelectProps<TFieldValues>): React.ReactElement {
    const { t } = useTranslation();
    const labelId = `${name}-label`;

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
                    size={selectProps.size}
                    disabled={selectProps.disabled}
                >
                    {label && <InputLabel id={labelId}>{label}</InputLabel>}

                    <Select
                        {...selectProps}
                        {...field}
                        labelId={labelId}
                        label={label}
                        value={field.value ?? ''}
                        // Обеспечиваем правильную обработку событий
                        onChange={(e) => {
                            field.onChange(e);

                            if (selectProps.onChange) {
                                selectProps.onChange(e, null as React.ReactNode);
                            }
                        }}
                        onBlur={(e) => {
                            field.onBlur();

                            if (selectProps.onBlur) {
                                selectProps.onBlur(e);
                            }
                        }}
                    >
                        {showEmptyOption && <MenuItem value="">{emptyOptionText || t('common.notSelected')}</MenuItem>}

                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>

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
