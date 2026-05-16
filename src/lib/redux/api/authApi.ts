import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('rb_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/register',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            sessionStorage.setItem('rb_user', JSON.stringify({ ...data.data.user, accessToken: data.data.accessToken }));
            localStorage.setItem('rb_token', data.data.accessToken);
          }
        } catch (err) {}
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            sessionStorage.setItem('rb_user', JSON.stringify({ ...data.data.user, accessToken: data.data.accessToken }));
            localStorage.setItem('rb_token', data.data.accessToken);
            localStorage.setItem('rb_refresh', data.data.refreshToken);
          }
        } catch (err) {}
      },
    }),
    getMe: builder.query({
      query: () => '/Auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
