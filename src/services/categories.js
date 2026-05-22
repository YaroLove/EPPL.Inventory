import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoriesApi = createApi({
  reducerPath: 'categories',
  baseQuery: fetchBaseQuery({ baseUrl: '/categories/', credentials: 'include' }),
  tagTypes: ['Category', 'Items'],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Category', 'Items'],
    }),
    deleteCategory: builder.mutation({
      query: ({ id, reassignTo }) => ({
        url: `${id}`,
        method: 'DELETE',
        body: reassignTo ? { reassignTo } : undefined,
      }),
      invalidatesTags: ['Category', 'Items'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
