import { apiSlice } from '../apiSlice';
import { UserOrganizationRequestDto, UserResponseDto, OrganizationResponseDto } from '../../models';

export const userOrganizationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение пользователей организации
        getUsersByOrganization: builder.query<Set<UserResponseDto>, number>({
            query: (organizationId) => `user-organizations/organizations/${organizationId}`,
            providesTags: (_, __, organizationId) => [{ type: 'Organization', id: `USERS_${organizationId}` }],
        }),

        // Получение организаций пользователя
        getOrganizationsByUser: builder.query<Set<OrganizationResponseDto>, number>({
            query: (userId) => `user-organizations/users/${userId}`,
            providesTags: (_, __, userId) => [{ type: 'User', id: `ORGANIZATIONS_${userId}` }],
        }),

        // Добавление пользователя в организацию
        addUserToOrganization: builder.mutation<void, UserOrganizationRequestDto>({
            query: (data) => ({
                url: 'user-organizations',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_, __, { userId, organizationId }) => [
                { type: 'User', id: `ORGANIZATIONS_${userId}` },
                { type: 'Organization', id: `USERS_${organizationId}` },
                { type: 'User', id: userId },
                { type: 'Organization', id: organizationId },
            ],
        }),

        // Удаление пользователя из организации
        removeUserFromOrganization: builder.mutation<void, UserOrganizationRequestDto>({
            query: (data) => ({
                url: 'user-organizations',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: (_, __, { userId, organizationId }) => [
                { type: 'User', id: `ORGANIZATIONS_${userId}` },
                { type: 'Organization', id: `USERS_${organizationId}` },
                { type: 'User', id: userId },
                { type: 'Organization', id: organizationId },
            ],
        }),
    }),
});

export const {
    useGetUsersByOrganizationQuery,
    useGetOrganizationsByUserQuery,
    useAddUserToOrganizationMutation,
    useRemoveUserFromOrganizationMutation,
} = userOrganizationsApi;
