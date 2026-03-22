import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/user/' }),
  tagTypes: ['Favorites', 'Settings', 'Profile'],
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => 'favorites',
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (itemId) => ({ url: `favorites/${itemId}`, method: 'POST' }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: builder.mutation({
      query: (itemId) => ({ url: `favorites/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Favorites'],
    }),
    getSettings: builder.query({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (body) => ({ url: 'settings', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: 'profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateProfileMutation,
} = userApi;
