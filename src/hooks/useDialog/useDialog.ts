import { useState, useCallback } from 'react';
import { IDialogState, IOpenDialogOptions, TDialogType, UseDialogReturn } from './types';

/**
 * Хук для управления состоянием диалоговых окон.
 *
 * Позволяет управлять различными типами диалогов с данными и параметрами.
 */
export const useDialog = <T = unknown, P = unknown>(): UseDialogReturn<T, P> => {
    const initialState: IDialogState<T, P> = {
        open: false,
        type: 'custom',
    };

    const [dialog, setDialog] = useState<IDialogState<T, P>>(initialState);

    const openDialog = useCallback((options: IOpenDialogOptions<T, P>) => {
        setDialog({
            open: true,
            type: options.type,
            data: options.data,
            params: options.params,
            title: options.title,
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(initialState);
    }, []);

    const updateDialogParams = useCallback((params: Partial<P>) => {
        setDialog((prev) => ({
            ...prev,
            params: { ...prev.params, ...params } as P,
        }));
    }, []);

    const isDialogOpen = useCallback((type: TDialogType) => dialog.open && dialog.type === type, [dialog]);

    const setDialogData = useCallback((data: T) => {
        setDialog((prev) => ({
            ...prev,
            data,
        }));
    }, []);

    return {
        dialog,
        openDialog,
        closeDialog,
        updateDialogParams,
        isDialogOpen,
        setDialogData,
    };
};
