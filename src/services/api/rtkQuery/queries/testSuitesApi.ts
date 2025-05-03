import { apiSlice } from '../apiSlice';
import { TestSuiteResponseDto, Page } from '../../models';

export const testSuitesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение тест-сюитов проекта с пагинацией
        getTestSuitesByProject: builder.query<
            Page<TestSuiteResponseDto>,
            {
                projectId: number;
                page?: number;
                size?: number;
            }
        >({
            query: ({ projectId, page = 0, size = 10 }) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: size.toString(),
                });

                return `test-suites/projects/${projectId}?${params.toString()}`;
            },
            providesTags: (result, _, { projectId }) =>
                result
                    ? [
                          ...result.content.map(({ id }) => ({ type: 'TestSuite' as const, id })),
                          { type: 'TestSuite', id: `PROJECT_${projectId}` },
                      ]
                    : [{ type: 'TestSuite', id: `PROJECT_${projectId}` }],
        }),

        // Получение тест-сюита по ID
        getTestSuiteById: builder.query<TestSuiteResponseDto, number>({
            query: (id) => `test-suites/${id}`,
            providesTags: (_, __, id) => [{ type: 'TestSuite', id }],
        }),

        // Создание тест-сюита
        createTestSuite: builder.mutation<
            TestSuiteResponseDto,
            {
                projectId: number;
                name: string;
                description?: string;
            }
        >({
            query: ({ projectId, name, description }) => ({
                url: `test-suites/projects/${projectId}`,
                method: 'POST',
                params: { name, description },
            }),
            invalidatesTags: (_, __, { projectId }) => [{ type: 'TestSuite', id: `PROJECT_${projectId}` }],
        }),

        // Удаление тест-сюита
        deleteTestSuite: builder.mutation<void, number>({
            query: (testSuiteId) => ({
                url: `test-suites/${testSuiteId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, testSuiteId) => [{ type: 'TestSuite', id: testSuiteId }],
            async onQueryStarted(testSuiteId, { dispatch, queryFulfilled }) {
                try {
                    const testSuite = await dispatch(
                        testSuitesApi.endpoints.getTestSuiteById.initiate(testSuiteId),
                    ).unwrap();

                    await queryFulfilled;

                    dispatch(
                        apiSlice.util.invalidateTags([{ type: 'TestSuite', id: `PROJECT_${testSuite.projectId}` }]),
                    );
                } catch (error) {
                    console.error('Failed to delete test suite:', error);
                }
            },
        }),

        // Добавление тест-кейса в тест-сюит
        addTestCaseToTestSuite: builder.mutation<
            TestSuiteResponseDto,
            {
                testSuiteId: number;
                testCaseId: number;
            }
        >({
            query: ({ testSuiteId, testCaseId }) => ({
                url: `test-suites/${testSuiteId}/test-cases/${testCaseId}`,
                method: 'POST',
            }),
            invalidatesTags: (_, __, { testSuiteId }) => [{ type: 'TestSuite', id: testSuiteId }],
        }),

        // Добавление нескольких тест-кейсов в тест-сюит
        addTestCasesToTestSuite: builder.mutation<
            TestSuiteResponseDto,
            {
                testSuiteId: number;
                testCaseIds: number[];
            }
        >({
            query: ({ testSuiteId, testCaseIds }) => ({
                url: `test-suites/${testSuiteId}/test-cases/bulk`,
                method: 'POST',
                body: testCaseIds,
            }),
            invalidatesTags: (_, __, { testSuiteId }) => [{ type: 'TestSuite', id: testSuiteId }],
        }),

        // Удаление тест-кейса из тест-сюита
        removeTestCaseFromTestSuite: builder.mutation<
            void,
            {
                testSuiteId: number;
                testCaseId: number;
            }
        >({
            query: ({ testSuiteId, testCaseId }) => ({
                url: `test-suites/${testSuiteId}/test-cases/${testCaseId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, __, { testSuiteId }) => [{ type: 'TestSuite', id: testSuiteId }],
        }),
    }),
});

export const {
    useGetTestSuitesByProjectQuery,
    useGetTestSuiteByIdQuery,
    useCreateTestSuiteMutation,
    useDeleteTestSuiteMutation,
    useAddTestCaseToTestSuiteMutation,
    useAddTestCasesToTestSuiteMutation,
    useRemoveTestCaseFromTestSuiteMutation,
} = testSuitesApi;
