// src/services/api/rtkQuery/queries/projectsApi.ts
import { apiSlice } from '../apiSlice';
import { ProjectRequestDto, ProjectResponseDto, PageProjectResponseDto, ProjectsQueryParams } from '../../models';

// Построитель URL с параметрами запроса
const buildQueryParams = (params: ProjectsQueryParams): string => {
    const { page = 0, size = 10, ...filters } = params;

    // Начальные параметры пагинации
    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    // Добавление сортировки
    if (params.sort && params.sort.length > 0) {
        params.sort.forEach((sortOption) => {
            queryParams.append('sort', sortOption);
        });
    }

    // Добавление фильтров
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.append(key, value.toString());
        }
    });

    return queryParams.toString();
};

// Расширяем apiSlice с эндпоинтами для работы с проектами
export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение всех проектов с пагинацией и фильтрацией
        getProjects: builder.query<PageProjectResponseDto, ProjectsQueryParams>({
            query: (params = {}) => ({
                url: `projects?${buildQueryParams(params)}`,
            }),
            // Более точная настройка тегов для эффективного инвалидирования кэша
            providesTags: (result) =>
                result
                    ? [
                          ...result.content.map(({ id }) => ({ type: 'Project' as const, id })),
                          { type: 'Project', id: 'LIST' },
                      ]
                    : [{ type: 'Project', id: 'LIST' }],
            // Трансформация ответа (при необходимости)
            transformResponse: (response: PageProjectResponseDto) => {
                // Можно выполнить дополнительную обработку данных
                return response;
            },
        }),

        // Получение проекта по ID
        getProjectById: builder.query<ProjectResponseDto, number>({
            query: (id) => `projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'Project', id }],
        }),

        // Создание нового проекта
        createProject: builder.mutation<ProjectResponseDto, ProjectRequestDto>({
            query: (projectData) => ({
                url: 'projects',
                method: 'POST',
                body: projectData,
            }),
            // Инвалидация всех связанных проектов при создании нового
            invalidatesTags: [
                { type: 'Project', id: 'LIST' },
                { type: 'Organization', id: 'LIST' },
            ],
        }),

        // Обновление проекта
        updateProject: builder.mutation<ProjectResponseDto, { id: number; data: ProjectRequestDto }>({
            query: ({ id, data }) => ({
                url: `projects/${id}`,
                method: 'PUT',
                body: data,
            }),
            // Инвалидация как конкретного проекта, так и списка
            invalidatesTags: (result, error, { id }) => [
                { type: 'Project', id },
                { type: 'Project', id: 'LIST' },
                { type: 'Organization', id: result?.organizationId },
            ],
        }),

        // Удаление проекта
        deleteProject: builder.mutation<void, number>({
            query: (id) => ({
                url: `projects/${id}`,
                method: 'DELETE',
            }),
            // Инвалидация списка проектов и потенциально связанных сущностей
            invalidatesTags: (result, error, id) => [
                { type: 'Project', id: 'LIST' },
                { type: 'Project', id },
                { type: 'TestPlan', id: 'LIST' },
            ],
        }),
    }),
    // Настройка переопределения кэша при необходимости
    overrideExisting: false,
});

// Экспорт хуков для использования в компонентах
export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    // Добавляем утилиты для предзагрузки
    usePrefetch,
} = projectsApi;
