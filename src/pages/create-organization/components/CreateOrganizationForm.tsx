import React, { memo } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, CircularProgress, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { useCreateOrganizationForm } from '../hooks/useCreateOrganizationForm';
import { flexMixins } from '@src/styles';

export const CreateOrganizationForm: React.FC = memo(() => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { form, isDemoChecked, isCreating, handleDemoCheckboxChange, handleSubmit } = useCreateOrganizationForm();
    const {
        control,
        formState: { errors },
    } = form;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500 }}>
            <Box sx={{ mb: 3 }}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('organizations.form.name')}
                            variant="outlined"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            disabled={isCreating}
                            placeholder={t('organizations.form.nameHolder')}
                            margin="normal"
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('organizations.form.description')}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            disabled={isCreating}
                            placeholder={t('organizations.form.descriptionHolder')}
                            margin="normal"
                        />
                    )}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isDemoChecked}
                            onChange={(e) => handleDemoCheckboxChange(e.target.checked)}
                            disabled={isCreating}
                        />
                    }
                    label={t('organizations.form.createDemo')}
                    sx={{ mt: 2, '& .MuiFormControlLabel-label': { fontSize: theme.typography.caption } }}
                />
            </Box>

            <Box sx={{ ...flexMixins.startWrap }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isCreating}
                    startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isCreating ? t('common.saving') : t('organizations.form.create')}
                </Button>
            </Box>
        </Box>
    );
});

CreateOrganizationForm.displayName = 'CreateOrganizationForm';
