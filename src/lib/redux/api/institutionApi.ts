import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const institutionApi = createApi({
  reducerPath: 'institutionApi',
  tagTypes: ['Institution'],
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
  endpoints: (builder) => ({
    adminGetInstitutions: builder.query<any, void>({
      query: () => '/institutions/all',
      providesTags: ['Institution'],
    }),
    adminUpdateInstitution: builder.mutation<any, { id: string; isVerified?: boolean; isActive?: boolean; awards?: string[]; promotions?: string[] }>({
      query: ({ id, ...body }) => ({
        url: `/institutions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Institution'],
    }),
  }),
});

export const {
  useAdminGetInstitutionsQuery,
  useAdminUpdateInstitutionMutation,
} = institutionApi;
