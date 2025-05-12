import { useErrorHandling } from '@hooks/useErrorHandling';
import { useNotification } from '@hooks/useNotification';
import { useState, useCallback } from 'react';
import { CrudFormCallbacks, CrudFormMessages, CrudFormOptions, CrudFormResult } from './types';

export function useCrudForm<TFormData = unknown, TEntity = unknown>(
    callbacks: CrudFormCallbacks<TFormData, TEntity>,
    messages: CrudFormMessages = {},
    options: CrudFormOptions = {},
): CrudFormResult<TFormData, TEntity> {
    const { showSuccess, showError } = useNotification();
    const { getErrorMessage } = useErrorHandling();

    // Состояния загрузки для разных операций
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<unknown>(null);

    // Установки по умолчанию
    const { showNotifications = true } = options;

    /**
     * Обработчик создания сущности
     */
    const handleCreate = useCallback(
        async (data: TFormData): Promise<TEntity | undefined> => {
            if (!callbacks.create) {
                console.warn('Create callback is not provided');

                return undefined;
            }

            setError(null);
            setIsCreating(true);

            try {
                const result = await callbacks.create(data);

                if (showNotifications && messages.createSuccess) {
                    showSuccess(messages.createSuccess);
                }

                return result;
            } catch (err) {
                setError(err);

                if (showNotifications) {
                    const errorMessage = messages.createError || getErrorMessage(err);

                    showError(errorMessage);
                }

                throw err;
            } finally {
                setIsCreating(false);
            }
        },
        [callbacks.create, messages, showNotifications],
    );

    /**
     * Обработчик обновления сущности
     */
    const handleUpdate = useCallback(
        async (id: number | string, data: TFormData): Promise<TEntity | undefined> => {
            if (!callbacks.update) {
                console.warn('Update callback is not provided');

                return undefined;
            }

            setError(null);
            setIsUpdating(true);

            try {
                const result = await callbacks.update(id, data);

                if (showNotifications && messages.updateSuccess) {
                    showSuccess(messages.updateSuccess);
                }

                return result;
            } catch (err) {
                setError(err);

                if (showNotifications) {
                    const errorMessage = messages.updateError || getErrorMessage(err);

                    showError(errorMessage);
                }

                throw err;
            } finally {
                setIsUpdating(false);
            }
        },
        [callbacks.update, messages, showNotifications],
    );

    /**
     * Обработчик удаления сущности
     */
    const handleDelete = useCallback(
        async (id: number | string): Promise<boolean> => {
            if (!callbacks.delete) {
                console.warn('Delete callback is not provided');

                return false;
            }

            setError(null);
            setIsDeleting(true);

            try {
                await callbacks.delete(id);

                if (showNotifications && messages.deleteSuccess) {
                    showSuccess(messages.deleteSuccess);
                }

                return true;
            } catch (err) {
                setError(err);

                if (showNotifications) {
                    const errorMessage = messages.deleteError || getErrorMessage(err);

                    showError(errorMessage);
                }

                return false;
            } finally {
                setIsDeleting(false);
            }
        },
        [callbacks.delete, messages, showNotifications],
    );

    // Общее состояние загрузки для любой операции
    const isLoading = isCreating || isUpdating || isDeleting;

    return {
        isCreating,
        isUpdating,
        isDeleting,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading,
    };
}
