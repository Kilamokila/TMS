import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetProjectsQuery, useCreateOrganizationMutation } from '@services/api/rtkQuery';
import { useTranslation } from 'react-i18next';
import { useTypedForm } from '@hooks/useTypedForm';
import { organizationSchema, OrganizationFormData, mapFormToOrganizationRequest } from '@schemas/organizations';

export const useCreateOrganizationForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isDemoChecked, setIsDemoChecked] = useState(false);

    // Загрузка проектов при монтировании компонента
    const { isLoading: isLoadingProjects } = useGetProjectsQuery({});

    // Мутация для создания организации
    const [createOrganization, { isLoading: isCreating, isSuccess, error }] = useCreateOrganizationMutation();

    // Инициализация формы с валидацией
    const form = useTypedForm<OrganizationFormData>({
        schema: organizationSchema,
        defaultValues: {
            name: '',
            description: '',
        },
        successMessage: t('organizations.createSuccess'),
    });

    // Обработчик изменения чекбокса демо-организации
    const handleDemoCheckboxChange = (checked: boolean) => {
        setIsDemoChecked(checked);

        if (checked) {
            // Заполнение формы демо-данными
            form.reset({
                name: 'DEMO',
                description: 'DEMO',
            });
        } else {
            // Сброс формы
            form.reset({
                name: '',
                description: '',
            });
        }
    };

    // Обработчик отправки формы
    const handleSubmit = form.handleSubmitWithStatus(async (data) => {
        const requestData = mapFormToOrganizationRequest(data);

        try {
            // Ожидаем результат создания организации
            await createOrganization(requestData).unwrap();

            // Если успешно, переходим на страницу проектов
            navigate({ to: '/projects' });
        } catch (error) {
            // Ошибка уже будет обработана в useTypedForm
            console.error('Failed to create organization:', error);
        }
    });

    return {
        form,
        isDemoChecked,
        isLoadingProjects,
        isCreating,
        isSuccess,
        error,
        handleDemoCheckboxChange,
        handleSubmit,
    };
};
