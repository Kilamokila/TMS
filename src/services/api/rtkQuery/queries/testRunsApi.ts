import { apiSlice } from '../apiSlice';
import {
    TestRunRequestDto,
    TestRunResponseDto,
    TestRunResultResponseDto,
    TestRunResultUpdateRequestDto,
    UpdateTestCaseResultInTestRunDto,
} from '../../models/testRun';

export const testRunsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Получение списка тестовых запусков по тестовому плану
        getTestRunsByTestPlan: builder.query<TestRunResponseDto[], number>({
            query: (testPlanId) => ({
                url: `test-runs?testPlanId=${testPlanId}`,
            }),
            providesTags: (result, _error, testPlanId) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'TestRun' as const, id })),
                          { type: 'TestRun' as const, id: `TESTPLAN_${testPlanId}` },
                      ]
                    : [{ type: 'TestRun' as const, id: `TESTPLAN_${testPlanId}` }],
        }),

        // Получение всех тестовых запусков (без фильтрации по testPlanId)
        getAllTestRuns: builder.query<TestRunResponseDto[], void>({
            query: () => ({
                url: `test-runs`,
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'TestRun' as const, id })), { type: 'TestRun', id: 'LIST' }]
                    : [{ type: 'TestRun', id: 'LIST' }],
        }),

        // Создание нового тестового запуска
        createTestRun: builder.mutation<TestRunResponseDto, TestRunRequestDto>({
            query: (testRunData) => ({
                url: 'test-runs',
                method: 'POST',
                body: testRunData,
            }),
            invalidatesTags: (_result, _error, { testPlanId }) => [
                { type: 'TestRun' as const, id: `TESTPLAN_${testPlanId}` },
                { type: 'TestRun', id: 'LIST' },
            ],
        }),

        // Получение данных тестового запуска по ID
        getTestRunById: builder.query<TestRunResponseDto, number>({
            query: (id) => ({
                url: `test-runs/${id}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'TestRun' as const, id }],
        }),

        // Получение результатов тестового запуска
        getTestRunResults: builder.query<TestRunResultResponseDto[], number>({
            query: (id) => ({
                url: `test-run-results?id=${id}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'TestRun' as const, id: `RESULTS_${id}` }],
        }),

        // Обновление результата тест-кейса в запуске
        updateTestCaseResult: builder.mutation<
            UpdateTestCaseResultInTestRunDto,
            {
                testCaseId: number;
                testRunId: number;
                data: TestRunResultUpdateRequestDto;
            }
        >({
            query: ({ testCaseId, testRunId, data }) => ({
                url: `test-run-results?testCaseId=${testCaseId}&testRunId=${testRunId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { testRunId }) => [
                { type: 'TestRun' as const, id: testRunId },
                { type: 'TestRun' as const, id: `RESULTS_${testRunId}` },
            ],
        }),

        // Завершение тестового запуска
        completeTestRun: builder.mutation<TestRunResultResponseDto[], number>({
            query: (id) => ({
                url: `test-run-results/${id}/complete`,
                method: 'PUT',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'TestRun' as const, id },
                { type: 'TestRun' as const, id: `RESULTS_${id}` },
                { type: 'TestRun', id: 'LIST' },
            ],
        }),
    }),
});

// Экспорт хуков для использования в компонентах
export const {
    useGetTestRunsByTestPlanQuery,
    useGetAllTestRunsQuery,
    useCreateTestRunMutation,
    useGetTestRunByIdQuery,
    useGetTestRunResultsQuery,
    useUpdateTestCaseResultMutation,
    useCompleteTestRunMutation,
} = testRunsApi;
