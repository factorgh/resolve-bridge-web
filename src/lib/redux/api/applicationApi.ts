import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rb_token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Application'],
  endpoints: (builder) => ({
    getApplications: builder.query<any, void>({
      query: () => '/Applications/my-applications',
      providesTags: ['Application']
    }),
    createApplication: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Applications',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Application']
    }),
    adminGetApplications: builder.query<any, { status?: string } | void>({
      query: (params) => ({
        url: '/Applications/admin',
        params: params || undefined
      }),
      providesTags: ['Application']
    }),
    adminReviewApplication: builder.mutation<any, { id: string; status: string; rejectionReason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/Applications/admin/${id}/review`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Application']
    }),
  }),
});

export const { 
  useGetApplicationsQuery, 
  useCreateApplicationMutation,
  useAdminGetApplicationsQuery,
  useAdminReviewApplicationMutation
} = applicationApi;
