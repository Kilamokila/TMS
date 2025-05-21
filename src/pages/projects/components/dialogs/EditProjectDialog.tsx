import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormDialog, FormTextField } from '@components/common/form';
import { useTypedForm } from '@hooks/useTypedForm';
import { useUpdateProjectMutation } from '@services/api/rtkQuery/queries/projectsApi';
import { projectEditSchema, ProjectEditFormData } from '@schemas/project';
import { ProjectResponseDto } from '@services/api/models/projects';
import { TextField } from '@mui/material';

interface EditProjectDialogProps {
    open: boolean;
    onClose: () => void;
    project: ProjectResponseDto | null;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({ open, onClose, project }) => {
    const { t } = useTranslation();
    const [updateProject, { isLoading }] = useUpdateProjectMutation();

    // Создаем форму с валидацией через zod
    const {
        control,
        handleSubmitWithStatus,
        reset,
        formState: { isValid },
    } = useTypedForm<ProjectEditFormData>({
        defaultValues: {
            name: project?.name || '',
            description: project?.description || '',
            organizationId: project?.organizationId || 0,
        },
        schema: projectEditSchema,
        successMessage: t('projects.projectUpdated'),
    });

    // Обновляем форму при изменении проекта
    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description || '',
                organizationId: project.organizationId,
            });
        }
    }, [project, reset]);

    // Обработчик отправки формы
    const handleSubmit = useCallback(
        handleSubmitWithStatus(async (data: ProjectEditFormData) => {
            if (project) {
                await updateProject({
                    id: project.id,
                    data: {
                        name: data.name,
                        description: data.description || undefined,
                        code: project.code, // Код не редактируется, но нужен для API
                        organizationId: data.organizationId,
                    },
                }).unwrap();
                onClose();
            }
        }),
        [updateProject, handleSubmitWithStatus, onClose, project],
    );

    if (!project) return null;

    return (
        <FormDialog
            open={open}
            title={t('projects.editProject')}
            onFormClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            submitDisabled={!isValid}
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

            <TextField
                label={t('projects.projectCode')}
                value={project.code}
                fullWidth
                margin="normal"
                disabled
                helperText={t('projects.codeCannotBeChanged')}
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
