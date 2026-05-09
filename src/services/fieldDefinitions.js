import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fieldDefinitionsApi = createApi({
  reducerPath: 'fieldDefinitions',
  baseQuery: fetchBaseQuery({
    baseUrl: '/field-definitions/',
    credentials: 'include',
  }),
  tagTypes: ['FieldDefinition'],
  endpoints: (builder) => ({
    getFieldDefinitions: builder.query({
      query: (includeHidden = false) =>
        includeHidden ? '?includeHidden=true' : '',
      providesTags: ['FieldDefinition'],
    }),
    addFieldDefinition: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FieldDefinition'],
    }),
    updateFieldDefinition: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FieldDefinition'],
    }),
    deleteFieldDefinition: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FieldDefinition'],
    }),
  }),
});

export const {
  useGetFieldDefinitionsQuery,
  useAddFieldDefinitionMutation,
  useUpdateFieldDefinitionMutation,
  useDeleteFieldDefinitionMutation,
} = fieldDefinitionsApi;
