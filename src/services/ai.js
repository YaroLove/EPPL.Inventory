import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiApi = createApi({
  reducerPath: 'ai',
  baseQuery: fetchBaseQuery({ baseUrl: '/ai/', credentials: 'include' }),
  endpoints: (builder) => ({
    askAI: builder.mutation({
      query: ({ question, history }) => ({
        url: 'ask',
        method: 'POST',
        body: { question, history },
      }),
    }),
    getSuggestions: builder.query({
      query: () => 'suggestions',
    }),
  }),
});

export const { useAskAIMutation, useGetSuggestionsQuery } = aiApi;
