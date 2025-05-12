export interface CrudFormCallbacks<TFormData, TEntity> {
    create?: (data: TFormData) => Promise<TEntity>;
    update?: (id: number | string, data: TFormData) => Promise<TEntity>;
    delete?: (id: number | string) => Promise<void>;
}

export interface CrudFormMessages {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
}

export interface CrudFormOptions {
    showNotifications?: boolean;
    validateBeforeSubmit?: boolean;
}

export interface CrudFormResult<TFormData, TEntity> {
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: unknown;
    handleCreate: (data: TFormData) => Promise<TEntity | undefined>;
    handleUpdate: (id: number | string, data: TFormData) => Promise<TEntity | undefined>;
    handleDelete: (id: number | string) => Promise<boolean>;
    isLoading: boolean;
}
