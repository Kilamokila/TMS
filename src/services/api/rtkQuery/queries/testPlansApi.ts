import { apiSlice } from '../apiSlice';
import {
    TestPlanRequestDto,
    TestPlanResponseDto,
    TestPlanTestCaseRequestDto,
    TestPlanTestCaseResponseDto,
} from '../../models/testPlans';

export const testPlansApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение тестовых планов проекта
        getTestPlansByProject: builder.query<TestPlanResponseDto[], number>({
            query: (projectId) => ({
                url: `test-plans/projects/${projectId}`,
            }),
            providesTags: (result, _error, projectId) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'TestPlan' as const, id })),
                          { type: 'TestPlan' as const, id: `PROJECT_${projectId}` },
                      ]
                    : [{ type: 'TestPlan' as const, id: `PROJECT_${projectId}` }],
        }),

        // Получение конкретного тестового плана по ID
        getTestPlanById: builder.query<TestPlanResponseDto, number>({
            query: (testPlanId) => ({
                url: `test-plans/${testPlanId}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'TestPlan' as const, id }],
        }),

        // Создание нового тестового плана
        createTestPlan: builder.mutation<TestPlanResponseDto, { projectId: number; testPlanData: TestPlanRequestDto }>({
            query: ({ projectId, testPlanData }) => ({
                url: `test-plans/projects/${projectId}`,
                method: 'POST',
                body: testPlanData,
            }),
            invalidatesTags: (_result, _error, { projectId }) => [
                { type: 'TestPlan' as const, id: `PROJECT_${projectId}` },
            ],
        }),

        // Обновление существующего тестового плана
        updateTestPlan: builder.mutation<TestPlanResponseDto, { testPlanId: number; testPlanData: TestPlanRequestDto }>(
            {
                query: ({ testPlanId, testPlanData }) => ({
                    url: `test-plans/${testPlanId}`,
                    method: 'PATCH',
                    body: testPlanData,
                }),
                invalidatesTags: (result, _error, { testPlanId }) =>
                    [
                        { type: 'TestPlan' as const, id: testPlanId },
                        result ? { type: 'TestPlan' as const, id: `PROJECT_${result.projectId}` } : null,
                    ].filter(Boolean),
            },
        ),

        // Удаление тестового плана
        deleteTestPlan: builder.mutation<void, number>({
            query: (testPlanId) => ({
                url: `test-plans/${testPlanId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, testPlanId) => [{ type: 'TestPlan' as const, id: testPlanId }],
            async onQueryStarted(testPlanId, { dispatch, queryFulfilled }) {
                try {
                    // Получаем тестовый план перед удалением, чтобы знать его projectId
                    const testPlan = await dispatch(
                        testPlansApi.endpoints.getTestPlanById.initiate(testPlanId),
                    ).unwrap();

                    await queryFulfilled;

                    // Инвалидируем список тестовых планов проекта
                    dispatch(apiSlice.util.invalidateTags([{ type: 'TestPlan', id: `PROJECT_${testPlan.projectId}` }]));
                } catch (error) {
                    console.error('Failed to delete test plan:', error);
                }
            },
        }),

        // Получение тест-кейсов тестового плана
        getTestPlanTestCases: builder.query<TestPlanTestCaseResponseDto[], number>({
            query: (testPlanId) => ({
                url: `test-plans/${testPlanId}/test-cases`,
            }),
            providesTags: (_result, _error, testPlanId) => [
                { type: 'TestPlan' as const, id: `TEST_CASES_${testPlanId}` },
            ],
        }),

        // Добавление тест-кейса в тестовый план
        addTestCaseToTestPlan: builder.mutation<
            TestPlanTestCaseResponseDto,
            { testPlanId: number; testCaseId: number }
        >({
            query: ({ testPlanId, testCaseId }) => ({
                url: `test-plans/${testPlanId}/test-cases/${testCaseId}`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, { testPlanId }) => [
                { type: 'TestPlan' as const, id: testPlanId },
                { type: 'TestPlan' as const, id: `TEST_CASES_${testPlanId}` },
            ],
        }),

        // Удаление тест-кейса из тестового плана
        removeTestCaseFromTestPlan: builder.mutation<void, { testPlanId: number; testCaseId: number }>({
            query: ({ testPlanId, testCaseId }) => ({
                url: `test-plans/${testPlanId}/test-cases/${testCaseId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { testPlanId }) => [
                { type: 'TestPlan' as const, id: testPlanId },
                { type: 'TestPlan' as const, id: `TEST_CASES_${testPlanId}` },
            ],
        }),

        // Обновление порядка тест-кейсов в тестовом плане
        updateTestCasesOrder: builder.mutation<void, { testPlanId: number; testCases: TestPlanTestCaseRequestDto[] }>({
            query: ({ testPlanId, testCases }) => ({
                url: `test-plans/${testPlanId}/test-cases/order`,
                method: 'PATCH',
                body: testCases,
            }),
            invalidatesTags: (_result, _error, { testPlanId }) => [
                { type: 'TestPlan' as const, id: `TEST_CASES_${testPlanId}` },
            ],
        }),
    }),
});

// Экспорт хуков для использования в компонентах
export const {
    useGetTestPlansByProjectQuery,
    useGetTestPlanByIdQuery,
    useCreateTestPlanMutation,
    useUpdateTestPlanMutation,
    useDeleteTestPlanMutation,
    useGetTestPlanTestCasesQuery,
    useAddTestCaseToTestPlanMutation,
    useRemoveTestCaseFromTestPlanMutation,
    useUpdateTestCasesOrderMutation,
} = testPlansApi;
