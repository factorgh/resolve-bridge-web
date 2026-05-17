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
  tagTypes: ['User'],
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
    getMe: builder.query<any, void>({
      query: () => '/Users/me',
      providesTags: ['User']
    }),
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Users/profile',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['User']
    }),
    getDashboardMetrics: builder.query<{ success: boolean; data: DashboardMetrics }, void>({
      query: () => '/Users/dashboard-metrics',
    }),
    getNewsArticles: builder.query<{ success: boolean; data: NewsArticle[] }, void>({
      query: () => '/News',
    }),
  }),
});

export const { useGetMeQuery, useUpdateProfileMutation, useGetDashboardMetricsQuery, useGetNewsArticlesQuery } = userApi;
