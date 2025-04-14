import React from 'react';
import { Box, Button, TextField, InputAdornment, IconButton, Typography, Breadcrumbs, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from '@tanstack/react-router';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '@router/routes';

interface TestPlanToolbarProps {
    projectId?: string;
    projectName?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onCreateTestPlan: () => void;
    selectedTestPlans: number[];
    isLoading: boolean;
}

export const TestPlanToolbar: React.FC<TestPlanToolbarProps> = ({
    projectId,
    projectName,
    searchValue,
    onSearchChange,
    onCreateTestPlan,
    selectedTestPlans,
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
            {/* Хлебные крошки */}
            {projectId && projectName && (
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link component={RouterLink} to={`/${ROUTES.PROJECTS}`} color="inherit">
                        {t('projects.title')}
                    </Link>
                    <Link component={RouterLink} to={`/${ROUTES.PROJECT}/${projectId}`} color="inherit">
                        {projectName}
                    </Link>
                    <Typography color="text.primary">{t('testPlans.title')}</Typography>
                </Breadcrumbs>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {projectId && (
                        <IconButton
                            component={RouterLink}
                            to={`/${ROUTES.PROJECT}/${projectId}`}
                            sx={{ mr: 1 }}
                            aria-label={t('testPlans.details.backToList')}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h4" component="h1">
                        {t('testPlans.title')}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onCreateTestPlan}
                    disabled={isLoading}
                >
                    {t('testPlans.createTestPlan')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder={t('testPlans.searchTestPlans')}
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

                {selectedTestPlans.length > 0 && (
                    <Typography variant="body2" color="primary" sx={{ ml: 'auto' }}>
                        {t('testPlans.selectedCount', { count: selectedTestPlans.length })}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
