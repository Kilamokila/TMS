import { useState, useCallback } from 'react';
import { INotification, TNotificationSeverity, IUseNotificationReturn, INotificationOptions } from './types';

const DEFAULT_DURATION = 5000;

/**
 * Хук для управления уведомлениями в приложении
 *
 * Позволяет управлять глобальными уведомлениями
 * и предоставляет удобные методы для показа уведомлений разных типов
 */

export const useNotification = (): IUseNotificationReturn => {
    const [notification, setNotification] = useState<INotification>({
        open: false,
        message: '',
        severity: 'info',
        autoHideDuration: DEFAULT_DURATION,
    });

    const showNotification = useCallback(
        (message: string, severity: TNotificationSeverity = 'info', options?: INotificationOptions) => {
            setNotification({
                open: true,
                message,
                severity,
                autoHideDuration: options?.autoHideDuration || DEFAULT_DURATION,
            });
        },
        [],
    );

    const showSuccess = useCallback(
        (message: string, options?: INotificationOptions) => {
            showNotification(message, 'success', options);
        },
        [showNotification],
    );

    const showError = useCallback(
        (message: string, options?: INotificationOptions) => {
            showNotification(message, 'error', options);
        },
        [showNotification],
    );

    const showInfo = useCallback(
        (message: string, options?: INotificationOptions) => {
            showNotification(message, 'info', options);
        },
        [showNotification],
    );

    const showWarning = useCallback(
        (message: string, options?: INotificationOptions) => {
            showNotification(message, 'warning', options);
        },
        [showNotification],
    );

    const hideNotification = useCallback(() => {
        setNotification((prev) => ({ ...prev, open: false }));
    }, []);

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
