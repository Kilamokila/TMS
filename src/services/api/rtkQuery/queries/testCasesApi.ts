import { apiSlice } from '../apiSlice';
import {
    TestCaseRequestDto,
    TestCaseResponseDto,
    TestStepRequestDto,
    TestStepResponseDto,
} from '../../models/testCase';

export const testCasesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение тестовых сценариев проекта
        getTestCasesByProject: builder.query<TestCaseResponseDto[], number>({
            query: (projectId) => ({
                url: `test-cases/projects/${projectId}`,
            }),
            providesTags: (result, _error, projectId) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'TestCase' as const, id })),
                          { type: 'TestCase' as const, id: `PROJECT_${projectId}` },
                      ]
                    : [{ type: 'TestCase' as const, id: `PROJECT_${projectId}` }],
        }),

        // Получение конкретного тестового сценария
        getTestCaseById: builder.query<TestCaseResponseDto, number>({
            query: (testCaseId) => ({
                url: `test-cases/${testCaseId}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'TestCase' as const, id }],
        }),

        // Создание тестового сценария
        createTestCase: builder.mutation<
            TestCaseResponseDto,
            { projectId: number; testCaseData: TestCaseRequestDto; testSteps: TestStepRequestDto[] }
        >({
            query: ({ projectId, testCaseData }) => ({
                url: `test-cases/projects/${projectId}`,
                method: 'POST',
                body: testCaseData,
            }),
            async onQueryStarted({ testSteps, projectId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: newTestCase } = await queryFulfilled;

                    // После создания тестового сценария добавляем шаги
                    if (testSteps && testSteps.length > 0) {
                        for (const step of testSteps) {
                            await dispatch(
                                testCasesApi.endpoints.createTestStep.initiate({
                                    testCaseId: newTestCase.id,
                                    testStepData: step,
                                }),
                            ).unwrap();
                        }

                        // После добавления всех шагов инвалидируем кэш тестового сценария
                        dispatch(
                            apiSlice.util.invalidateTags([
                                { type: 'TestCase', id: newTestCase.id },
                                { type: 'TestCase', id: `PROJECT_${projectId}` },
                            ]),
                        );
                    }
                } catch (error) {
                    // Обработка ошибок
                    console.error('Failed to create test case with steps:', error);
                }
            },
            invalidatesTags: (_result, _error, { projectId }) => [
                { type: 'TestCase' as const, id: `PROJECT_${projectId}` },
            ],
        }),

        // Обновление тестового сценария
        updateTestCase: builder.mutation<TestCaseResponseDto, { testCaseId: number; testCaseData: TestCaseRequestDto }>(
            {
                query: ({ testCaseId, testCaseData }) => ({
                    url: `test-cases/${testCaseId}`,
                    method: 'PATCH',
                    body: testCaseData,
                }),
                invalidatesTags: (result, _error, { testCaseId }) =>
                    [
                        { type: 'TestCase' as const, id: testCaseId },
                        result ? { type: 'TestCase' as const, id: `PROJECT_${result.projectId}` } : null,
                    ].filter(Boolean),
            },
        ),

        // Обновление статуса тест-кейса
        updateTestCaseStatus: builder.mutation<
            TestCaseResponseDto,
            { testCaseId: number; status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED' }
        >({
            query: ({ testCaseId, status }) => ({
                url: `test-cases/${testCaseId}/status`,
                method: 'PATCH',
                body: status,
            }),
            invalidatesTags: (result, _error, { testCaseId }) =>
                [
                    { type: 'TestCase' as const, id: testCaseId },
                    result ? { type: 'TestCase' as const, id: `PROJECT_${result.projectId}` } : null,
                ].filter(Boolean),
        }),

        // Обновление приоритета тест-кейса
        updateTestCasePriority: builder.mutation<
            TestCaseResponseDto,
            { testCaseId: number; priority: 'LOW' | 'MEDIUM' | 'HIGH' }
        >({
            query: ({ testCaseId, priority }) => ({
                url: `test-cases/${testCaseId}/priority`,
                method: 'PATCH',
                body: priority,
            }),
            invalidatesTags: (result, _error, { testCaseId }) =>
                [
                    { type: 'TestCase' as const, id: testCaseId },
                    result ? { type: 'TestCase' as const, id: `PROJECT_${result.projectId}` } : null,
                ].filter(Boolean),
        }),

        // Удаление тестового сценария
        deleteTestCase: builder.mutation<void, number>({
            query: (testCaseId) => ({
                url: `test-cases/${testCaseId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, testCaseId) => [{ type: 'TestCase' as const, id: testCaseId }],
            async onQueryStarted(testCaseId, { dispatch, queryFulfilled }) {
                try {
                    // Получаем тестовый сценарий перед удалением, чтобы знать его projectId
                    const testCase = await dispatch(
                        testCasesApi.endpoints.getTestCaseById.initiate(testCaseId),
                    ).unwrap();

                    await queryFulfilled;

                    // Инвалидируем список тестовых сценариев проекта
                    dispatch(apiSlice.util.invalidateTags([{ type: 'TestCase', id: `PROJECT_${testCase.projectId}` }]));
                } catch (error) {
                    console.error('Failed to delete test case:', error);
                }
            },
        }),

        // Создание шага тестового сценария
        createTestStep: builder.mutation<TestStepResponseDto, { testCaseId: number; testStepData: TestStepRequestDto }>(
            {
                query: ({ testCaseId, testStepData }) => ({
                    url: `test-steps/test-cases/${testCaseId}`,
                    method: 'POST',
                    body: testStepData,
                }),
                invalidatesTags: (_result, _error, { testCaseId }) => [{ type: 'TestCase' as const, id: testCaseId }],
            },
        ),

        // Обновление шага тестового сценария
        updateTestStep: builder.mutation<
            TestStepResponseDto,
            { testStepId: number; testStepData: TestStepRequestDto; testCaseId: number }
        >({
            query: ({ testStepId, testStepData }) => ({
                url: `test-steps/${testStepId}`,
                method: 'PATCH',
                body: testStepData,
            }),
            invalidatesTags: (_result, _error, { testStepId, testCaseId }) => [
                { type: 'TestStep' as const, id: testStepId },
                { type: 'TestCase' as const, id: testCaseId },
            ],
        }),

        // Удаление шага тестового сценария
        deleteTestStep: builder.mutation<void, { testStepId: number; testCaseId: number }>({
            query: ({ testStepId }) => ({
                url: `test-steps/${testStepId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { testStepId, testCaseId }) => [
                { type: 'TestStep' as const, id: testStepId },
                { type: 'TestCase' as const, id: testCaseId },
            ],
        }),
    }),
});

// Экспорт хуков для использования в компонентах
export const {
    useGetTestCasesByProjectQuery,
    useGetTestCaseByIdQuery,
    useCreateTestCaseMutation,
    useUpdateTestCaseMutation,
    useUpdateTestCaseStatusMutation,
    useUpdateTestCasePriorityMutation,
    useDeleteTestCaseMutation,
    useCreateTestStepMutation,
    useUpdateTestStepMutation,
    useDeleteTestStepMutation,
} = testCasesApi;
