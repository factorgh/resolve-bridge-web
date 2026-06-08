import { baseApi } from './baseApi';

export interface AnalyticsOverview {
  statusCounts: Record<string, number>;
  totalApplicationVolume: number;
  transactionByCategory: Array<{ _id: string; volume: number; count: number }>;
  monthlyDisbursements: Array<{ label: string; total: number }>;
  invoiceSummary: Record<string, { count: number; amount: number }>;
  auditActionCounts: Array<{ _id: string; count: number }>;
  recentEvents: Array<any>;
}

export const analyticsApi = baseApi.injectEndpoints({
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
  overrideExisting: true,
});

export const {
  useGetAdminAnalyticsOverviewQuery,
  useGetAdminAnalyticsEventsQuery,
} = analyticsApi;
