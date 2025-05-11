export type TDialogType = 'create' | 'edit' | 'delete' | 'view' | 'custom';

export interface IDialogState<T = unknown, P = unknown> {
    open: boolean;
    type: TDialogType;
    data?: T;
    params?: P;
    title?: string;
}
export interface IOpenDialogOptions<T = unknown, P = unknown> {
    type: TDialogType;
    data?: T;
    params?: P;
    title?: string;
}

export interface UseDialogReturn<T = unknown, P = unknown> {
    dialog: IDialogState<T, P>;

    openDialog: (options: IOpenDialogOptions<T, P>) => void;

    closeDialog: () => void;

    updateDialogParams: (params: Partial<P>) => void;

    isDialogOpen: (type: TDialogType) => boolean;

    setDialogData: (data: T) => void;
}
