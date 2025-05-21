import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { InputBase, IconButton, Paper, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear, placeholder }) => {
    const { t } = useTranslation();

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange],
    );

    return (
        <Paper
            component="div"
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
        >
            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            <InputBase
                value={value}
                onChange={handleChange}
                placeholder={placeholder || t('projects.searchProjects')}
                fullWidth
                sx={{ ml: 1 }}
            />
            {value && (
                <Tooltip title={t('common.clear')}>
                    <IconButton size="small" onClick={onClear} edge="end">
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Paper>
    );
};
