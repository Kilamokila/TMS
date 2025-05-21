import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash-es';

interface UseProjectSearchReturn {
    searchTerm: string;
    debouncedSearchTerm: string;
    setSearchTerm: (value: string) => void;
    clearSearch: () => void;
}

/**
 * Хук для работы с поиском проектов с debounce
 */
export const useProjectSearch = (delay: number = 1000): UseProjectSearchReturn => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

    const debouncedSetSearch = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearchTerm(value);
            }, delay),
        [delay],
    );

    useEffect(() => {
        debouncedSetSearch(searchTerm);

        return () => {
            debouncedSetSearch.cancel();
        };
    }, [searchTerm, debouncedSetSearch]);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    }, []);

    return {
        searchTerm,
        debouncedSearchTerm,
        setSearchTerm,
        clearSearch,
    };
};
