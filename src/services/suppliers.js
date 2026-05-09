import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const suppliersApi = createApi({
  reducerPath: 'suppliers',
  baseQuery: fetchBaseQuery({ baseUrl: '/suppliers/', credentials: 'include' }),
  tagTypes: ['Supplier'],
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
    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Supplier'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
