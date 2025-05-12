import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotification } from '../useNotification';
import { UseTypedFormOptions, UseTypedFormReturn } from './types';

/**
 * Хук для работы с типизированными формами, интегрированный с Zod и react-hook-form
 */
export function useTypedForm<TFormValues extends FieldValues = FieldValues>({
    schema,
    showSuccessNotification = true,
    showErrorNotification = true,
    successMessage,
    formatErrorMessage,
    ...formOptions
}: UseTypedFormOptions<TFormValues> = {}): UseTypedFormReturn<TFormValues> {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<unknown>(null);
    const { showSuccess, showError } = useNotification();

    const formMethods = useForm<TFormValues>({
        ...formOptions,
        resolver: schema ? zodResolver(schema) : undefined,
    });

    const handleSubmitWithStatus =
        (onValid: SubmitHandler<TFormValues>, onInvalid?: SubmitErrorHandler<TFormValues>) =>
        async (e?: React.BaseSyntheticEvent) => {
            setSubmitError(null);

            return formMethods.handleSubmit(async (data) => {
                try {
                    setIsSubmitting(true);
                    await onValid(data);

                    if (showSuccessNotification && successMessage) {
                        showSuccess(successMessage);
                    }
                } catch (error) {
                    setSubmitError(error);

                    if (showErrorNotification) {
                        const errorMessage = formatErrorMessage
                            ? formatErrorMessage(error)
                            : error instanceof Error
                              ? error.message
                              : typeof error === 'string'
                                ? error
                                : 'Произошла ошибка при отправке формы';

                        showError(errorMessage);
                    }

                    throw error;
                } finally {
                    setIsSubmitting(false);
                }
            }, onInvalid)(e);
        };

    return {
        ...formMethods,
        isSubmitting,
        submitError,
        handleSubmitWithStatus,
    };
}
