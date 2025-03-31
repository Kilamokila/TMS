// Общие типы и интерфейсы для всех API

export interface SortObject {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface PageableObject {
    offset: number;
    sort: SortObject;
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
}

export interface PageableParams {
    page?: number;
    size?: number;
    sort?: string[];
}

export interface Page<T> {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    content: T[];
    sort: SortObject;
    first: boolean;
    last: boolean;
    pageable: PageableObject;
    numberOfElements: number;
    empty: boolean;
}

export type ApiError = {
    status: number;
    data: {
        message: string;
        errors?: Record<string, string[]>;
    };
};

export interface ResponseWrapper {
    data: unknown;
}
