import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shoppingApi = createApi({
    reducerPath: 'shopping',
    baseQuery: fetchBaseQuery({ baseUrl: '/shopping/' }),
    tagTypes: ['ShoppingItem'],
    endpoints: (builder) => ({
        getShoppingList: builder.query({
            query: () => '',
            providesTags: ['ShoppingItem'],
        }),
        addShoppingItem: builder.mutation({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['ShoppingItem'],
        }),
        updateShoppingItem: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['ShoppingItem'],
        }),
        deleteShoppingItem: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ShoppingItem'],
        }),
    }),
});

export const {
    useGetShoppingListQuery,
    useAddShoppingItemMutation,
    useUpdateShoppingItemMutation,
    useDeleteShoppingItemMutation,
} = shoppingApi;
