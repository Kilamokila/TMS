import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { TViewMode, VIEW_MODE } from '../../hooks/useProjectsView';

interface ViewToggleButtonsProps {
    viewMode: TViewMode;
    onViewChange: (mode: TViewMode) => void;
}

export const ViewToggleButtons: React.FC<ViewToggleButtonsProps> = ({ viewMode, onViewChange }) => {
    const { t } = useTranslation();

    const handleChange = (_: React.MouseEvent<HTMLElement>, newView: TViewMode | null) => {
        if (newView !== null) {
            onViewChange(newView);
        }
    };

    return (
        <ToggleButtonGroup value={viewMode} exclusive onChange={handleChange} aria-label="view mode" size="small">
            <Tooltip title={t('projects.viewAsList')}>
                <ToggleButton value={VIEW_MODE.TABLE} aria-label="list view">
                    <ViewListIcon />
                </ToggleButton>
            </Tooltip>
            <Tooltip title={t('projects.viewAsGrid')}>
                <ToggleButton value={VIEW_MODE.GRID} aria-label="grid view">
                    <ViewModuleIcon />
                </ToggleButton>
            </Tooltip>
        </ToggleButtonGroup>
    );
};
