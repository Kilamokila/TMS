export type TNotificationSeverity = 'success' | 'error' | 'info' | 'warning';

export interface INotification {
    open: boolean;
    message: string;
    severity: TNotificationSeverity;
    autoHideDuration?: number;
}

export interface INotificationOptions {
    autoHideDuration?: number;
}

export interface IUseNotificationReturn {
    notification: INotification;

    showNotification: (message: string, severity?: TNotificationSeverity, options?: INotificationOptions) => void;

    showSuccess: (message: string, options?: INotificationOptions) => void;

    showError: (message: string, options?: INotificationOptions) => void;

    showInfo: (message: string, options?: INotificationOptions) => void;

    showWarning: (message: string, options?: INotificationOptions) => void;

    hideNotification: () => void;
}
