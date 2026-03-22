import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const historyApi = createApi({
  reducerPath: 'historyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/history/' }),
  tagTypes: ['History'],
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: () => '',
      providesTags: ['History'],
    }),
  }),
});

export const { useGetHistoryQuery } = historyApi;
