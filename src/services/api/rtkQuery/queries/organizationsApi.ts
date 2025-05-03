import { apiSlice } from '../apiSlice';
import { OrganizationRequestDto, OrganizationResponseDto, Page } from '../../models';

export const organizationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение всех организаций с пагинацией
        getOrganizations: builder.query<
            Page<OrganizationResponseDto>,
            { page?: number; size?: number; sort?: string[] }
        >({
            query: ({ page = 0, size = 10, sort = [] }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: size.toString(),
                });

                sort.forEach((s) => params.append('sort', s));

                return `organizations?${params.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.content.map(({ id }) => ({ type: 'Organization' as const, id })),
                          { type: 'Organization', id: 'LIST' },
                      ]
                    : [{ type: 'Organization', id: 'LIST' }],
        }),

        // Получение организации по ID
        getOrganizationById: builder.query<OrganizationResponseDto, number>({
            query: (id) => `organizations/${id}`,
            providesTags: (_, __, id) => [{ type: 'Organization', id }],
        }),

        // Создание новой организации
        createOrganization: builder.mutation<OrganizationResponseDto, OrganizationRequestDto>({
            query: (data) => ({
                url: 'organizations',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Organization', id: 'LIST' }],
        }),

        // Обновление организации
        updateOrganization: builder.mutation<OrganizationResponseDto, { id: number; data: OrganizationRequestDto }>({
            query: ({ id, data }) => ({
                url: `organizations/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: 'Organization', id },
                { type: 'Organization', id: 'LIST' },
            ],
        }),

        // Удаление организации
        deleteOrganization: builder.mutation<void, number>({
            query: (id) => ({
                url: `organizations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, id) => [
                { type: 'Organization', id },
                { type: 'Organization', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetOrganizationsQuery,
    useGetOrganizationByIdQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
} = organizationsApi;
