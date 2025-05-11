import { useCallback, useRef } from 'react';
import {
    isApiError,
    getErrorMessage as apiGetErrorMessage,
    getFieldErrors as apiGetFieldErrors,
} from '@services/api/rtkQuery';
import { useNotification } from '../useNotification';
import {
    EErrorType,
    IErrorInfo,
    IUseErrorHandlingReturn,
    IErrorHandlers,
    TErrorHandlerFn,
    IErrorHandlingOptions,
} from './types';

const DEFAULT_OPTIONS: Required<IErrorHandlingOptions> = {
    messages: {},
    showNotifications: true,
    logToConsole: true,
};

/**
 * Хук для централизованной обработки ошибок API
 */
export const useErrorHandling = (options: IErrorHandlingOptions = {}): IUseErrorHandlingReturn => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { showError: showNotificationError } = useNotification();

    const errorHandlersRef = useRef<IErrorHandlers>({});

    const determineErrorType = useCallback((error: unknown): EErrorType => {
        if (isApiError(error)) {
            const statusCode = error.status;

            switch (statusCode) {
                case 401:
                    return EErrorType.AUTH;
                case 403:
                    return EErrorType.FORBIDDEN;
                case 404:
                    return EErrorType.NOT_FOUND;
            }

            if (error.data.errors) return EErrorType.VALIDATION;

            if (statusCode >= 500) return EErrorType.SERVER;
        }

        if (error instanceof Error) {
            if (error.message.includes('network') || error.message.includes('connection')) {
                return EErrorType.NETWORK;
            }

            if (error.message.includes('timeout')) {
                return EErrorType.TIMEOUT;
            }
        }

        return EErrorType.UNKNOWN;
    }, []);

    const handleError = useCallback(
        (error: unknown): IErrorInfo => {
            const errorType = determineErrorType(error);
            const message = mergedOptions.messages[errorType] || apiGetErrorMessage(error);
            const fieldErrors = isApiError(error) ? apiGetFieldErrors(error) : undefined;
            const statusCode = isApiError(error) ? error.status : undefined;

            const errorInfo: IErrorInfo = {
                type: errorType,
                message,
                statusCode,
                fieldErrors,
                originalError: error,
                technicalMessage: error instanceof Error ? error.message : String(error),
            };

            if (mergedOptions.logToConsole) {
                console.error(`[Error Handler] ${errorInfo.type.toUpperCase()}: ${errorInfo.message}`, error);
            }

            const handler = errorHandlersRef.current[errorType];

            if (handler) {
                handler(errorInfo);
            }

            return errorInfo;
        },
        [determineErrorType, mergedOptions.logToConsole, mergedOptions.messages],
    );

    const showError = useCallback(
        (error: unknown) => {
            const errorInfo = handleError(error);

            if (mergedOptions.showNotifications) {
                showNotificationError(errorInfo.message);
            }
        },
        [handleError, mergedOptions.showNotifications, showNotificationError],
    );

    const getErrorMessage = useCallback(
        (error: unknown): string => {
            return handleError(error).message;
        },
        [handleError],
    );

    const addErrorHandler = useCallback(<T extends EErrorType>(type: T, handler: TErrorHandlerFn) => {
        errorHandlersRef.current[type] = handler;

        return () => {
            delete errorHandlersRef.current[type];
        };
    }, []);

    return {
        handleError,
        showError,
        getErrorMessage,
        isApiError,
        getFieldErrors: apiGetFieldErrors,
        addErrorHandler,
    };
};
