import { baseApi } from './baseApi';

export const documentApi = baseApi.injectEndpoints({
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
    uploadFileRaw: builder.mutation<any, FormData>({
      query: (body) => ({
        url: '/Documents/upload-file',
        method: 'POST',
        body
      })
    }),
    deleteDocument: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Documents/my-documents/${id}`,
        method: 'DELETE'
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
  overrideExisting: true,
});

export const { 
  useGetDocumentsQuery, 
  useUploadDocumentMutation,
  useUploadFileRawMutation,
  useDeleteDocumentMutation,
  useAdminGetPendingDocumentsQuery,
  useAdminVerifyDocumentMutation
} = documentApi;
