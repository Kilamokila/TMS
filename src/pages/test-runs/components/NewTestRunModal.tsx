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
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    InputAdornment,
    SelectChangeEvent,
    Chip,
    Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';

export interface TestRunFormData {
    title: string;
    description: string;
    environment?: string;
    milestone?: string;
    defaultAssignee?: string;
    tags?: string[];
    configurations?: {
        os?: string;
    };
    testSource: 'repository' | 'testPlan' | 'savedQuery';
    selectedTestCases: string[];
}

export interface EditTestRunData {
    title: string;
    description?: string;
    environment?: string;
    status?: string;
}

interface NewTestRunModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TestRunFormData) => void;
}

// Примерные данные для селектов
const environments = [{ id: 1, name: 'Example env' }];

const milestones = [
    { id: 1, name: 'v1.0 Release' },
    { id: 2, name: 'v1.1 Release' },
];

const users = [
    { id: 1, name: 'Иван Петров', avatar: 'ИП' },
    { id: 2, name: 'Анна Смирнова', avatar: 'АС' },
    { id: 3, name: 'Михаил Иванов', avatar: 'МИ' },
    { id: 4, name: 'Елена Кузнецова', avatar: 'ЕК' },
];

const tags = [
    { id: 1, name: 'API' },
    { id: 2, name: 'Frontend' },
    { id: 3, name: 'Backend' },
    { id: 4, name: 'Critical' },
    { id: 5, name: 'High Priority' },
    { id: 6, name: 'Regression' },
];

const operatingSystems = [
    { id: 1, name: 'Windows OS' },
    { id: 2, name: 'macOS' },
    { id: 3, name: 'Linux' },
];

export const NewTestRunModal: React.FC<NewTestRunModalProps> = ({ open, onClose, onSubmit }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<TestRunFormData>({
        title: `Test run ${new Date().toISOString().split('T')[0].replace(/-/g, '/')}`,
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

            if (parent === 'configurations') {
                setFormData((prev) => ({
                    ...prev,
                    configurations: {
                        ...prev.configurations,
                        [child]: value as string,
                    },
                }));
            }
        } else if (name === 'tags') {
            setFormData((prev) => ({
                ...prev,
                [name]: value as string[],
            }));
        } else {
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
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3,
                    fontWeight: 'bold',
                }}
            >
                {t('testRuns.newTestRun.title')}
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 0 }}>
                <Grid container spacing={3}>
                    {/* Run Type and Title */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <Select
                                    name="runType"
                                    value="manual"
                                    displayEmpty
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    }
                                    sx={{ height: 40 }}
                                >
                                    <MenuItem value="manual">{t('testRuns.newTestRun.manual')}</MenuItem>
                                    <MenuItem value="automated" disabled>
                                        Automated
                                    </MenuItem>
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
                                sx={{ height: 40 }}
                                InputProps={{ sx: { height: 40 } }}
                            />
                        </Grid>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            {t('testRuns.edit.descriptionLabel')}
                        </Typography>
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
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                {t('testRuns.newTestRun.environment')}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="environment"
                                    value={formData.environment}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : t('testRuns.newTestRun.notSet'))}
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.notSet')}</MenuItem>
                                    {environments.map((env) => (
                                        <MenuItem key={env.id} value={env.name}>
                                            {env.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                {t('testRuns.newTestRun.milestone')}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="milestone"
                                    value={formData.milestone}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : t('testRuns.newTestRun.notSet'))}
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.notSet')}</MenuItem>
                                    {milestones.map((milestone) => (
                                        <MenuItem key={milestone.id} value={milestone.name}>
                                            {milestone.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Default Assignee and Tags */}
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                {t('testRuns.newTestRun.defaultAssignee')}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="defaultAssignee"
                                    value={formData.defaultAssignee}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (!selected) return t('testRuns.newTestRun.selectValue');

                                        // Найти пользователя по ID и вернуть его имя для отображения
                                        const selectedUser = users.find((user) => user.id.toString() === selected);

                                        if (selectedUser) {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            bgcolor: 'primary.main',
                                                            fontSize: '0.75rem',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        {selectedUser.avatar}
                                                    </Avatar>
                                                    {selectedUser.name}
                                                </Box>
                                            );
                                        }

                                        return t('testRuns.newTestRun.selectValue');
                                    }}
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id.toString()}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        bgcolor: 'primary.main',
                                                        fontSize: '0.75rem',
                                                        mr: 1,
                                                    }}
                                                >
                                                    {user.avatar}
                                                </Avatar>
                                                {user.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                {t('testRuns.newTestRun.tags')}
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if ((selected as string[]).length === 0) {
                                            return t('testRuns.newTestRun.selectValue');
                                        }

                                        return (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Chip key={value} label={value} size="small" />
                                                ))}
                                            </Box>
                                        );
                                    }}
                                    multiple
                                >
                                    <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                                    {tags.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.name}>
                                            {tag.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Configurations */}
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            {t('testRuns.newTestRun.configurations')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                            {t('testRuns.newTestRun.operatingSystem')}
                        </Typography>
                        <FormControl sx={{ width: '40%' }}>
                            <Select
                                name="configurations.os"
                                value={formData.configurations?.os || ''}
                                onChange={handleSelectChange}
                                displayEmpty
                                renderValue={(selected) => selected || t('testRuns.newTestRun.selectValue')}
                            >
                                <MenuItem value="">{t('testRuns.newTestRun.selectValue')}</MenuItem>
                                {operatingSystems.map((os) => (
                                    <MenuItem key={os.id} value={os.name}>
                                        {os.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Tests */}
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            {t('testRuns.newTestRun.tests')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2">
                                {t('testRuns.newTestRun.testCasesSelected', {
                                    count: formData.selectedTestCases.length,
                                })}
                            </Typography>
                            <IconButton size="small" disabled={formData.selectedTestCases.length === 0} sx={{ ml: 1 }}>
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
                                <Button
                                    variant="outlined"
                                    disabled={formData.testSource !== 'repository'}
                                    sx={{ textTransform: 'none' }}
                                >
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

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                <Button onClick={onClose} variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!formData.title}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                    }}
                >
                    {t('testRuns.newTestRun.startRun')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
