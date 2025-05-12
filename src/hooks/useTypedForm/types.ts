import type { ZodType, ZodTypeDef } from 'zod';
import type { UseFormProps, UseFormReturn, FieldValues, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';

export interface UseTypedFormOptions<TFormValues extends FieldValues>
    extends Omit<UseFormProps<TFormValues>, 'resolver'> {
    schema?: ZodType<TFormValues, ZodTypeDef, TFormValues>;
    showSuccessNotification?: boolean;
    successMessage?: string;
    showErrorNotification?: boolean;
    formatErrorMessage?: (error: unknown) => string;
}

export interface UseTypedFormReturn<TFormValues extends FieldValues> extends UseFormReturn<TFormValues> {
    isSubmitting: boolean;
    submitError: unknown;
    handleSubmitWithStatus: (
        onValid: SubmitHandler<TFormValues>,
        onInvalid?: SubmitErrorHandler<TFormValues>,
    ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}
