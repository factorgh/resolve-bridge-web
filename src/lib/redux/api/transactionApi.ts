import { baseApi } from './baseApi';

export const transactionApi = baseApi.injectEndpoints({
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
  overrideExisting: true,
});

export const { 
  useGetTransactionsQuery,
  useCreateTransactionMutation
} = transactionApi;
