import { apiSlice } from '../apiSlice';
import { ProjectUserRequestDto, UserResponseDto, ProjectResponseDto } from '../../models';

export const projectUsersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение пользователей проекта
        getUsersByProject: builder.query<Set<UserResponseDto>, number>({
            query: (projectId) => `project-users/projects/${projectId}`,
            providesTags: (_, __, projectId) => [{ type: 'Project', id: `USERS_${projectId}` }],
        }),

        // Получение проектов пользователя
        getProjectsByUser: builder.query<Set<ProjectResponseDto>, number>({
            query: (userId) => `project-users/users/${userId}`,
            providesTags: (_, __, userId) => [{ type: 'User', id: `PROJECTS_${userId}` }],
        }),

        // Добавление пользователя в проект
        addUserToProject: builder.mutation<void, ProjectUserRequestDto>({
            query: (data) => ({
                url: 'project-users',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, __, { userId, projectId }) => [
                { type: 'User', id: `PROJECTS_${userId}` },
                { type: 'Project', id: `USERS_${projectId}` },
                { type: 'User', id: userId },
                { type: 'Project', id: projectId },
            ],
        }),

        // Удаление пользователя из проекта
        removeUserFromProject: builder.mutation<void, ProjectUserRequestDto>({
            query: (data) => ({
                url: 'project-users',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: (_, __, { userId, projectId }) => [
                { type: 'User', id: `PROJECTS_${userId}` },
                { type: 'Project', id: `USERS_${projectId}` },
                { type: 'User', id: userId },
                { type: 'Project', id: projectId },
            ],
        }),
    }),
});

export const {
    useGetUsersByProjectQuery,
    useGetProjectsByUserQuery,
    useAddUserToProjectMutation,
    useRemoveUserFromProjectMutation,
} = projectUsersApi;
