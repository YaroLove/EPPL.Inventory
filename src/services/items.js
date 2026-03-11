import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const itemsApi = createApi({
  reducerPath: 'items',
  baseQuery: fetchBaseQuery({
    baseUrl: '/items/',
  }),
  tagTypes: ['MedCart', 'PowerLab', 'Bloodwork', 'Physioflow'],
  endpoints: (builder) => ({
    getMedCart: builder.query({
      query: () => `MedCart`,
      providesTags: ['MedCart'],
    }),
    getPowerLab: builder.query({
      query: () => `PowerLab`,
      providesTags: ['PowerLab'],
    }),
    getBloodwork: builder.query({
      query: () => `Bloodwork`,
      providesTags: ['Bloodwork'],
    }),
    getPhysioflow: builder.query({
      query: () => `Physioflow`,
      providesTags: ['Physioflow'],
    }),
    addItem: builder.mutation({
      query({ category, ...body }) {
        return {
          url: `${category}`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['MedCart', 'PowerLab', 'Bloodwork', 'Physioflow'],
    }),
    deleteItem: builder.mutation({
      query({ id, category }) {
        return {
          url: `${category}/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['MedCart', 'PowerLab', 'Bloodwork', 'Physioflow'],
    }),
    updateItem: builder.mutation({
      query({ id, category, ...body }) {
        return {
          url: `${category}/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['MedCart', 'PowerLab', 'Bloodwork', 'Physioflow'],
    }),
  }),
});

export const {
  useGetMedCartQuery,
  useGetPowerLabQuery,
  useGetBloodworkQuery,
  useGetPhysioflowQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} = itemsApi;
