import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AnalyticsOverview {
  statusCounts: Record<string, number>;
  totalApplicationVolume: number;
  transactionByCategory: Array<{ _id: string; volume: number; count: number }>;
  monthlyDisbursements: Array<{ label: string; total: number }>;
  invoiceSummary: Record<string, { count: number; amount: number }>;
  auditActionCounts: Array<{ _id: string; count: number }>;
  recentEvents: Array<any>;
}

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  tagTypes: ["Analytics"],
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
    getAdminAnalyticsOverview: builder.query<
      { success: boolean; data: AnalyticsOverview },
      void
    >({
      query: () => "/Analytics/overview",
    }),
    getAdminAnalyticsEvents: builder.query<
      { success: boolean; data: Array<any> },
      void
    >({
      query: () => "/Analytics/events",
    }),
  }),
});

export const {
  useGetAdminAnalyticsOverviewQuery,
  useGetAdminAnalyticsEventsQuery,
} = analyticsApi;
