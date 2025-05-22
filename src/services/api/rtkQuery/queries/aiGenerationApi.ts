import { AITestSuite } from '@services/api/models/aiAssistant';

import { apiSlice } from '../apiSlice';

export const aiAssistant = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateTestSuite: builder.mutation<AITestSuite, string>({
            query: (data) => ({
                url: '/ai/generate-test-suite',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGenerateTestSuiteMutation } = aiAssistant;
