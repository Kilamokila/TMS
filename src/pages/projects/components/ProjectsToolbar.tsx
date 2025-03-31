import React from 'react';
import { Box, Button, TextField, InputAdornment, IconButton, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ClearIcon from '@mui/icons-material/Clear';

interface ProjectsToolbarProps {
    onCreateProject: () => void;
    onToggleView: () => void;
    viewMode: 'list' | 'grid';
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddFilter: () => void;
    filtersCount: number;
}

export const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
    onCreateProject,
    onToggleView,
    viewMode,
    searchValue,
    onSearchChange,
    onAddFilter,
    filtersCount,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    const handleClearSearch = () => {
        onSearchChange('');
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('projects.title')}
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onCreateProject}>
                    {t('projects.createNewProject')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder={t('projects.searchProjects')}
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ minWidth: 250, flexGrow: { xs: 1, sm: 0 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchValue && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                    edge="end"
                                    aria-label="clear search"
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={onAddFilter}
                    color="inherit"
                    sx={{
                        borderColor: theme.palette.divider,
                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                        },
                    }}
                >
                    {t('projects.addFilter')}
                    {filtersCount > 0 && (
                        <Box
                            component="span"
                            sx={{
                                ml: 1,
                                px: 1,
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                borderRadius: '50%',
                                fontSize: '0.75rem',
                            }}
                        >
                            {filtersCount}
                        </Box>
                    )}
                </Button>

                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    <IconButton
                        color={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => viewMode !== 'list' && onToggleView()}
                        size="small"
                        aria-label={t('projects.viewAsList')}
                    >
                        <ViewListIcon />
                    </IconButton>
                    <IconButton
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => viewMode !== 'grid' && onToggleView()}
                        size="small"
                        aria-label={t('projects.viewAsGrid')}
                    >
                        <ViewModuleIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};
