import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const documentApi = createApi({
  reducerPath: 'documentApi',
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
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    getDocuments: builder.query<any, void>({
      query: () => '/Documents/my-documents',
      providesTags: ['Document']
    }),
    uploadDocument: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Documents/upload',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Document']
    }),
    adminGetPendingDocuments: builder.query<any, void>({
      query: () => '/Documents/admin',
      providesTags: ['Document']
    }),
    adminVerifyDocument: builder.mutation<any, { id: string; isVerified: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/Documents/admin/${id}/verify`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Document']
    }),
  }),
});

export const { 
  useGetDocumentsQuery, 
  useUploadDocumentMutation,
  useAdminGetPendingDocumentsQuery,
  useAdminVerifyDocumentMutation
} = documentApi;
