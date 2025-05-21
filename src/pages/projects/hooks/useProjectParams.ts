import { useCallback, useState } from 'react';
import { ProjectsQueryParams } from '@services/api/models/projects';
import { useProjectSearch } from './useProjectSearch';

type SortDirection = 'asc' | 'desc';

interface SortState {
    field: string;
    direction: SortDirection;
}

interface ProjectsParams extends ProjectsQueryParams {
    page: number;
    size: number;
    sort: string[];
}

interface UseProjectParamsReturn {
    params: ProjectsParams;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    clearSearch: () => void;
    sortState: SortState;
    updateSort: (field: string) => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    resetParams: () => void;
}

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_FIELD = 'name';
const DEFAULT_SORT_DIRECTION: SortDirection = 'asc';

/**
 * Хук для управления параметрами запроса проектов
 */
export const useProjectParams = (): UseProjectParamsReturn => {
    const { searchTerm, debouncedSearchTerm, setSearchTerm, clearSearch } = useProjectSearch();

    const [sortState, setSortState] = useState<SortState>({
        field: DEFAULT_SORT_FIELD,
        direction: DEFAULT_SORT_DIRECTION,
    });

    const [page, setPage] = useState<number>(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

    const buildParams = useCallback((): ProjectsParams => {
        const sortString = `${sortState.field},${sortState.direction}`;

        return {
            page,
            size: pageSize,
            sort: [sortString],
            name: debouncedSearchTerm || undefined,
        };
    }, [page, pageSize, sortState, debouncedSearchTerm]);

    const updateSort = useCallback((field: string) => {
        setSortState((prev) => {
            if (prev.field === field) {
                return {
                    field,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc',
                };
            }

            return {
                field,
                direction: 'asc',
            };
        });
    }, []);

    const resetParams = useCallback(() => {
        setPage(DEFAULT_PAGE);
        setPageSize(DEFAULT_PAGE_SIZE);
        setSortState({
            field: DEFAULT_SORT_FIELD,
            direction: DEFAULT_SORT_DIRECTION,
        });
        clearSearch();
    }, [clearSearch]);

    return {
        params: buildParams(),
        searchTerm,
        setSearchTerm,
        clearSearch,
        sortState,
        updateSort,
        setPage,
        setPageSize,
        resetParams,
    };
};
