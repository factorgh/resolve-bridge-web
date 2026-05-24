import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PaymentHistoryItem {
  _id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryResponse {
  transactions: PaymentHistoryItem[];
  total: number;
  limit: number;
  skip: number;
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  tagTypes: ["Payment"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("rb_token") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    initiatePayment: builder.mutation<
      any,
      {
        email: string;
        amount: number;
        description: string;
        metadata?: Record<string, any>;
        productId?: string;
        applicationId?: string;
      }
    >({
      query: (body) => ({
        url: "/Payments/initiate",
        method: "POST",
        body,
      }),
    }),
    getPaymentHistory: builder.query<
      { success: boolean; data: PaymentHistoryResponse },
      { status?: string; limit?: number; skip?: number }
    >({
      query: ({ status, limit = 10, skip = 0 }) => ({
        url: "/Payments/history",
        params: { status, limit, skip },
      }),
      providesTags: ["Payment"],
    }),
    retryPayment: builder.mutation<any, { reference: string }>({
      query: ({ reference }) => ({
        url: `/Payments/retry/${reference}`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentHistoryQuery,
  useRetryPaymentMutation,
} = paymentApi;
