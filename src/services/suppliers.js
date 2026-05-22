import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const suppliersApi = createApi({
  reducerPath: 'suppliers',
  baseQuery: fetchBaseQuery({ baseUrl: '/suppliers/', credentials: 'include' }),
  tagTypes: ['Supplier', 'Items'],
  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: () => '',
      providesTags: ['Supplier'],
    }),
    addSupplier: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Supplier'],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, name }) => ({
        url: `${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Supplier', 'Items'],
    }),
    deleteSupplier: builder.mutation({
      query: ({ id, reassignTo }) => ({
        url: `${id}`,
        method: 'DELETE',
        body: reassignTo ? { reassignTo } : undefined,
      }),
      invalidatesTags: ['Supplier', 'Items'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
