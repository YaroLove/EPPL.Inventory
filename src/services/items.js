import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const itemsApi = createApi({
  reducerPath: 'items',
  baseQuery: fetchBaseQuery({
    baseUrl: '/items/',
    credentials: 'include',
  }),
  tagTypes: ['Items'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (category) => `${category}`,
      providesTags: (result, error, category) => [{ type: 'Items', id: category }],
    }),
    getAllItems: builder.query({
      query: () => '',
      providesTags: ['Items'],
    }),
    getItemsBySupplier: builder.query({
      query: (supplier) => `by-supplier/${supplier}`,
      providesTags: (result, error, supplier) => [{ type: 'Items', id: `supplier-${supplier}` }],
    }),
    getDistinctValues: builder.query({
      query: (field) => `distinct/${encodeURIComponent(field)}`,
    }),
    addItem: builder.mutation({
      query({ category, ...body }) {
        return {
          url: `${category}`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Items'],
    }),
    deleteItem: builder.mutation({
      query({ id, category }) {
        return {
          url: `${category}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Items'],
    }),
    updateItem: builder.mutation({
      query({ id, category, ...body }) {
        return {
          url: `${category}/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Items'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetAllItemsQuery,
  useGetItemsBySupplierQuery,
  useGetDistinctValuesQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} = itemsApi;
