import { apiSlice } from '../apiSlice';
import { UserRequestDto, UserResponseDto, Page } from '../../models';

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение всех пользователей с пагинацией
        getUsers: builder.query<Page<UserResponseDto>, { page?: number; size?: number; sort?: string[] }>({
            query: ({ page = 0, size = 10, sort = [] }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: size.toString(),
                });

                sort.forEach((s) => params.append('sort', s));

                return `users?${params.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [...result.content.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // Получение пользователя по ID
        getUserById: builder.query<UserResponseDto, number>({
            query: (id) => `users/${id}`,
            providesTags: (_, __, id) => [{ type: 'User', id }],
        }),

        // Обновление пользователя
        updateUser: builder.mutation<UserResponseDto, { id: number; data: UserRequestDto }>({
            query: ({ id, data }) => ({
                url: `users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),

        // Удаление пользователя
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, id) => [
                { type: 'User', id },
                { type: 'User', id: 'LIST' },
            ],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
