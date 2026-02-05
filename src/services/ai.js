import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
    reducerPath: 'ai',
    baseQuery: fetchBaseQuery({ baseUrl: '/ai/' }),
    endpoints: (builder) => ({
        askAI: builder.mutation({
            query: (question) => ({
                url: 'ask',
                method: 'POST',
                body: { question },
            }),
        }),
    }),
});

export const { useAskAIMutation } = aiApi;
