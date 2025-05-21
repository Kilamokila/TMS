import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '@components/common/form';
import { useDeleteProjectMutation } from '@services/api/rtkQuery/queries/projectsApi';
import { ProjectResponseDto } from '@services/api/models/projects';
import { useNotification } from '@hooks/useNotification';
import { useErrorHandling } from '@hooks/useErrorHandling';

interface DeleteProjectConfirmationProps {
    open: boolean;
    onClose: () => void;
    project: ProjectResponseDto | null;
}

export const DeleteProjectConfirmation: React.FC<DeleteProjectConfirmationProps> = ({ open, onClose, project }) => {
    const { t } = useTranslation();
    const [deleteProject, { isLoading }] = useDeleteProjectMutation();
    const { showSuccess, showError } = useNotification();
    const { getErrorMessage } = useErrorHandling();

    const handleConfirm = useCallback(async () => {
        if (project) {
            try {
                await deleteProject(project.id).unwrap();
                showSuccess(t('projects.projectDeleted')); // Показываем уведомление об успехе
                onClose();
            } catch (error) {
                console.error('Failed to delete project:', error);
                showError(getErrorMessage(error) || t('common.errorOccurred')); // Показываем уведомление об ошибке
                onClose();
            }
        }
    }, [deleteProject, project, onClose, showSuccess, showError, getErrorMessage, t]);

    if (!project) return null;

    return (
        <ConfirmationDialog
            open={open}
            title={t('projects.deleteProject')}
            message={t('projects.deleteProjectConfirm')}
            hint={t('projects.deleteProjectWarning')}
            itemTitle={project.name}
            onConfirm={handleConfirm}
            onCancel={onClose}
            isLoading={isLoading}
            confirmButtonColor="error"
            confirmButtonText={t('common.delete')}
            showWarningIcon
        />
    );
};
