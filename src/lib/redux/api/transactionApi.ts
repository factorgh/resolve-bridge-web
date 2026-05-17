import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
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
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactions: builder.query<any, void>({
      query: () => '/Transactions',
      providesTags: ['Transaction']
    }),
    createTransaction: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Transactions',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Transaction']
    }),
  }),
});

export const { 
  useGetTransactionsQuery,
  useCreateTransactionMutation
} = transactionApi;
