import React from 'react';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface ProjectHeaderProps {
    projectCode: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onCreateTestCase: () => void;
    selectedTestCases: number[];
    isLoading: boolean;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
    projectCode,
    searchValue,
    onSearchChange,
    onCreateTestCase,
    selectedTestCases,
    isLoading,
}) => {
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">
                        {projectCode}
                    </Typography>
                    <Typography variant="h5" component="span" sx={{ mx: 1, color: 'text.secondary' }}>
                        /
                    </Typography>
                    <Typography variant="h5" component="span" color="primary">
                        {t('testCases.repository')}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onCreateTestCase}
                    disabled={isLoading}
                >
                    {t('testCases.createTestCase')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder={t('testCases.searchTestCases')}
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    disabled={isLoading}
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

                {selectedTestCases.length > 0 && (
                    <Typography variant="body2" color="primary" sx={{ ml: 'auto' }}>
                        {t('testCases.selectedCount', { count: selectedTestCases.length })}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
