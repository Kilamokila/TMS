import { useState, useCallback, useEffect } from 'react';
import { LocalStorageUtil } from '@services/storage';
import { EStorageKeys } from '@services/storage/storageKeys';

export const VIEW_MODE = {
    TABLE: 'table',
    GRID: 'grid',
} as const;

export type TViewMode = (typeof VIEW_MODE)[keyof typeof VIEW_MODE];

interface UseProjectsViewReturn {
    viewMode: TViewMode;
    isTableView: boolean;
    isGridView: boolean;
    setTableView: () => void;
    setGridView: () => void;
    toggleView: () => void;
}

/**
 * Хук для управления режимом отображения проектов (таблица/карточки)
 */
export const useProjectsView = (): UseProjectsViewReturn => {
    const [viewMode, setViewMode] = useState<TViewMode>(
        () => LocalStorageUtil.getItem(EStorageKeys.PROJECTS_VIEW_MODE) ?? VIEW_MODE.TABLE,
    );

    useEffect(() => {
        LocalStorageUtil.setItem(EStorageKeys.PROJECTS_VIEW_MODE, viewMode);
    }, [viewMode]);

    const setTableView = useCallback(() => {
        setViewMode(VIEW_MODE.TABLE);
    }, []);

    const setGridView = useCallback(() => {
        setViewMode(VIEW_MODE.GRID);
    }, []);

    const toggleView = useCallback(() => {
        setViewMode((prev) => (prev === VIEW_MODE.TABLE ? VIEW_MODE.GRID : VIEW_MODE.TABLE));
    }, []);

    return {
        viewMode,
        isTableView: viewMode === VIEW_MODE.TABLE,
        isGridView: viewMode === VIEW_MODE.GRID,
        setTableView,
        setGridView,
        toggleView,
    };
};
