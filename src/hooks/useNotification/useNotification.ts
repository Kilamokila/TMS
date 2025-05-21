import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    showNotification as showNotificationAction,
    hideNotification as hideNotificationAction,
} from '@store/slices/notificationSlice';
import { TNotificationSeverity, IUseNotificationReturn, INotificationOptions } from './types';

export const useNotification = (): IUseNotificationReturn => {
    const dispatch = useAppDispatch();
    const notification = useAppSelector((state) => state.notification);

    const showNotification = useCallback(
        (message: string, severity: TNotificationSeverity = 'info', options?: INotificationOptions) => {
            dispatch(
                showNotificationAction({
                    message,
                    severity,
                    autoHideDuration: options?.autoHideDuration,
                }),
            );
        },
        [dispatch],
    );

    // Вспомогательные методы для разных типов уведомлений
    const showSuccess = useCallback(
        (message: string, options?: INotificationOptions) => showNotification(message, 'success', options),
        [showNotification],
    );

    const showError = useCallback(
        (message: string, options?: INotificationOptions) => showNotification(message, 'error', options),
        [showNotification],
    );

    const showInfo = useCallback(
        (message: string, options?: INotificationOptions) => showNotification(message, 'info', options),
        [showNotification],
    );

    const showWarning = useCallback(
        (message: string, options?: INotificationOptions) => showNotification(message, 'warning', options),
        [showNotification],
    );

    const hideNotification = useCallback(() => {
        dispatch(hideNotificationAction());
    }, [dispatch]);

    return {
        notification,
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        hideNotification,
    };
};
