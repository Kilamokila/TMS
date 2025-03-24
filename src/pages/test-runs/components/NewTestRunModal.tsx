import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    //  InputLabel,
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    //  useTheme,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';

interface NewTestRunModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TestRunFormData) => void;
}

export interface TestRunFormData {
    runType: string;
    title: string;
    description: string;
    environment: string;
    milestone: string;
    defaultAssignee: string;
    tags: string[];
    configurations: {
        os: string;
    };
    testSource: 'repository' | 'testPlan' | 'savedQuery';
    selectedTestCases: string[];
}

export const NewTestRunModal: React.FC<NewTestRunModalProps> = ({ open, onClose, onSubmit }) => {
    const { t } = useTranslation();
    //  const theme = useTheme();

    const [formData, setFormData] = useState<TestRunFormData>({
        runType: 'manual',
        title: '',
        description: '',
        environment: '',
        milestone: '',
        defaultAssignee: '',
        tags: [],
        configurations: {
            os: '',
        },
        testSource: 'repository',
        selectedTestCases: [],
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
        const { name, value } = event.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            // Явно проверяем, что родительское поле - configurations
            if (parent === 'configurations') {
                setFormData((prev) => ({
                    ...prev,
                    configurations: {
                        ...prev.configurations,
                        [child]: value as string, // Для внутренних полей ожидаем строки
                    },
                }));
            }
        } else if (name === 'tags') {
            // Специальная обработка для массива тегов
            setFormData((prev) => ({
                ...prev,
                [name]: value as string[], // Для тегов ожидаем массив строк
            }));
        } else {
            // Для остальных полей ожидаем строковые значения
            setFormData((prev) => ({
                ...prev,
                [name]: value as string,
            }));
        }
    };

    const handleTestSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            testSource: event.target.value as 'repository' | 'testPlan' | 'savedQuery',
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Typography variant="h6" component="div">
                    {t('testRuns.newTestRun.title')}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 1 }}>
                <Grid container spacing={3}>
                    {/* Run Type and Title */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <Select
                                    name="runType"
                                    value={formData.runType}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    startAdornment={<PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                                >
                                    <MenuItem value="manual">{t('testRuns.newTestRun.manual')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder={t('testRuns.newTestRun.titlePlaceholder')}
                            />
                        </Grid>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={t('testRuns.newTestRun.descriptionPlaceholder')}
                        />
                    </Grid>

                    {/* Environment and Milestone */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Select
                                    name="environment"
                                    value={formData.environment}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : t('testRuns.newTestRun.notSet'))}
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.notSet')}</MenuItem>
                                </Select>
                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                    {t('testRuns.newTestRun.environment')}
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Select
                                    name="milestone"
                                    value={formData.milestone}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : t('testRuns.newTestRun.notSet'))}
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.notSet')}</MenuItem>
                                </Select>
                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                    {t('testRuns.newTestRun.milestone')}
                                </Typography>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Default Assignee and Tags */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Select
                                    name="defaultAssignee"
                                    value={formData.defaultAssignee}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) =>
                                        selected ? selected : t('testRuns.newTestRun.selectValue')
                                    }
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                                </Select>
                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                    {t('testRuns.newTestRun.defaultAssignee')}
                                </Typography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Select
                                    name="tags"
                                    value={formData.tags} // Используем массив из состояния
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) =>
                                        selected.length === 0
                                            ? t('testRuns.newTestRun.selectValue')
                                            : selected.join(', ')
                                    }
                                    multiple
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                                    {/* Здесь можно добавить другие теги */}
                                </Select>
                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                    {t('testRuns.newTestRun.tags')}
                                </Typography>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    {/* Configurations */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            {t('testRuns.newTestRun.configurations')}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                            {t('testRuns.newTestRun.operatingSystem')}
                        </Typography>
                        <FormControl sx={{ width: '40%' }}>
                            <Select
                                name="configurations.os"
                                value={formData.configurations.os}
                                onChange={handleSelectChange}
                                displayEmpty
                                renderValue={() => t('testRuns.newTestRun.selectValue')}
                            >
                                <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    {/* Tests */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">{t('testRuns.newTestRun.tests')}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Typography variant="body2">
                                {t('testRuns.newTestRun.testCasesSelected', { count: 0 })}
                            </Typography>
                            <IconButton size="small" disabled={formData.selectedTestCases.length === 0}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <RadioGroup value={formData.testSource} onChange={handleTestSourceChange} sx={{ mt: 2 }}>
                            <FormControlLabel
                                value="repository"
                                control={<Radio color="primary" />}
                                label={t('testRuns.newTestRun.fromRepository')}
                            />
                            <Box sx={{ ml: 4, my: 2 }}>
                                <Button variant="outlined" disabled={formData.testSource !== 'repository'}>
                                    {t('testRuns.newTestRun.selectCases')}
                                </Button>
                            </Box>

                            <FormControlLabel
                                value="testPlan"
                                control={<Radio color="primary" />}
                                label={t('testRuns.newTestRun.fromTestPlan')}
                            />

                            <FormControlLabel
                                value="savedQuery"
                                control={<Radio color="primary" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('testRuns.newTestRun.fromSavedQuery')}
                                        <LockIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                                    </Box>
                                }
                                disabled
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                                {t('testRuns.newTestRun.businessPlanFeature')}
                            </Typography>
                        </RadioGroup>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!formData.title}>
                    {t('testRuns.newTestRun.startRun')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
