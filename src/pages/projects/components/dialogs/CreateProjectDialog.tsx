import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormDialog, FormTextField } from '@components/common/form';
import { useTypedForm } from '@hooks/useTypedForm';
import { useCreateProjectMutation } from '@services/api/rtkQuery/queries/projectsApi';
import { projectSchema, mapFormToProjectRequest, ProjectFormData } from '@schemas/project';

interface CreateProjectDialogProps {
    open: boolean;
    onClose: () => void;
    organizationId: number;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ open, onClose, organizationId }) => {
    const { t } = useTranslation();
    const [createProject, { isLoading }] = useCreateProjectMutation();

    // Создаем форму с валидацией через zod
    const {
        control,
        handleSubmitWithStatus,
        reset,
        formState: { isValid },
    } = useTypedForm<ProjectFormData>({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            organizationId: organizationId,
        },
        schema: projectSchema,
        successMessage: t('projects.projectCreated'),
    });

    const handleSubmit = useCallback(
        handleSubmitWithStatus(async (data: ProjectFormData) => {
            await createProject(mapFormToProjectRequest(data)).unwrap();
            onClose();
            reset();
        }),
        [createProject, handleSubmitWithStatus, onClose, reset],
    );

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    return (
        <FormDialog
            open={open}
            title={t('projects.projectCreate.title')}
            onFormClose={handleClose}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            submitDisabled={!isValid}
            submitButtonText={t('common.create')}
            maxWidth="sm"
            fullWidth
        >
            <FormTextField
                control={control}
                name="name"
                label={t('projects.projectCreate.projectName')}
                placeholder={t('projects.nameHolder')}
                fullWidth
                required
                margin="normal"
            />

            <FormTextField
                control={control}
                name="code"
                label={t('projects.projectCode')}
                placeholder={t('projects.codeHolder')}
                fullWidth
                required
                margin="normal"
                helperText={t('projects.codeHint')}
            />

            <FormTextField
                control={control}
                name="description"
                label={t('projects.description')}
                placeholder={t('projects.descriptionHolder')}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
        </FormDialog>
    );
};
