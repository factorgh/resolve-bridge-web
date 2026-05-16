import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface DashboardMetrics {
  healthIndex: number;
  cashFlow: number;
  netWorth: number;
  creditScore: number;
  eligibleOffers: number;
  healthIndexMessage: string;
  velocityData: { label: string; value: number }[];
  healthFactors: HealthFactor[];
}

export interface HealthFactor {
  name: string;
  status: string;
  color: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  tag: string;
  icon: string;
  imageUrl?: string;
  externalUrl?: string;
  readingTimeMinutes: number;
  publishedAt: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
    prepareHeaders: (headers) => {
      const userStr = sessionStorage.getItem('rb_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.accessToken) {
          headers.set('authorization', `Bearer ${user.accessToken}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<{ success: boolean; data: DashboardMetrics }, void>({
      query: () => 'Users/dashboard-metrics',
    }),
    getNewsArticles: builder.query<{ success: boolean; data: NewsArticle[] }, void>({
      query: () => 'News',
    }),
  }),
});

export const { useGetDashboardMetricsQuery, useGetNewsArticlesQuery } = userApi;
