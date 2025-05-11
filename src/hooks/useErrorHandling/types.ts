import { ApiError } from '@services/api/models';

export enum EErrorType {
    VALIDATION = 'validation',
    AUTH = 'auth',
    FORBIDDEN = 'forbidden',
    NOT_FOUND = 'not_found',
    SERVER = 'server',
    NETWORK = 'network',
    TIMEOUT = 'timeout',
    UNKNOWN = 'unknown',
}

export interface IErrorInfo {
    type: EErrorType;
    message: string;
    technicalMessage?: string;
    statusCode?: number;
    fieldErrors?: Record<string, string[]>;
    originalError?: unknown;
}
export interface IErrorHandlingOptions {
    messages?: Partial<Record<EErrorType, string>>;
    showNotifications?: boolean;
    logToConsole?: boolean;
}
export type TShowErrorFn = (error: unknown) => void;

export type TErrorHandlerFn = (errorInfo: IErrorInfo) => void;

export interface IErrorHandlers {
    [EErrorType.VALIDATION]?: TErrorHandlerFn;
    [EErrorType.AUTH]?: TErrorHandlerFn;
    [EErrorType.FORBIDDEN]?: TErrorHandlerFn;
    [EErrorType.NOT_FOUND]?: TErrorHandlerFn;
    [EErrorType.SERVER]?: TErrorHandlerFn;
    [EErrorType.NETWORK]?: TErrorHandlerFn;
    [EErrorType.TIMEOUT]?: TErrorHandlerFn;
    [EErrorType.UNKNOWN]?: TErrorHandlerFn;
}

export interface IUseErrorHandlingReturn {
    handleError: (error: unknown) => IErrorInfo;

    showError: TShowErrorFn;

    getErrorMessage: (error: unknown) => string;

    isApiError: (error: unknown) => error is ApiError;

    getFieldErrors: (error: unknown) => Record<string, string[]> | undefined;

    addErrorHandler: <T extends EErrorType>(type: T, handler: TErrorHandlerFn) => () => void;
}
