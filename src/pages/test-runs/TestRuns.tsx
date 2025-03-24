import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
// import { TestRunsTable, NewTestRunModal, TestRunFormData } from './components';
import { TestRunsTable } from './components/TestRunsTable';
import { NewTestRunModal } from './components/NewTestRunModal';
import { TestRunFormData } from './components/NewTestRunModal';
import { MOCK_TEST_RUNS } from './model/testRun';

export const TestRuns: React.FC = () => {
    //  const theme = useTheme();
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [isNewTestRunModalOpen, setIsNewTestRunModalOpen] = useState(false);

    // В реальном приложении здесь будет логика загрузки данных с API
    const testRuns = MOCK_TEST_RUNS;

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleStartNewTestRun = () => {
        setIsNewTestRunModalOpen(true);
    };

    const handleCloseNewTestRunModal = () => {
        setIsNewTestRunModalOpen(false);
    };

    const handleCreateTestRun = (data: TestRunFormData) => {
        console.log('New test run data:', data);
        // Здесь будет логика для сохранения нового тестового прогона
        setIsNewTestRunModalOpen(false);
    };

    const handleAddFilter = () => {
        // Логика для добавления фильтра
        console.log('Add filter clicked');
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('testRuns.title')}
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleStartNewTestRun}>
                    {t('testRuns.startNewTestRun')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <TextField
                    placeholder={t('testRuns.searchPlaceholder')}
                    variant="outlined"
                    size="small"
                    value={searchValue}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="outlined" color="primary" onClick={handleAddFilter}>
                    {t('testRuns.addFilter')}
                </Button>
            </Box>

            <TestRunsTable testRuns={testRuns} />

            <NewTestRunModal
                open={isNewTestRunModalOpen}
                onClose={handleCloseNewTestRunModal}
                onSubmit={handleCreateTestRun}
            />
        </Box>
    );
};
