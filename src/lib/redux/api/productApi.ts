import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5251/api/v1',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('rb_token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<any, { productType?: string; searchTerm?: string; providerType?: string[] }>({
      query: (params) => ({ 
        url: '/products/search', 
        params 
      }),
      providesTags: ['Product']
    }),
    getRecommendations: builder.query<any, void>({
      query: () => '/products/recommendations',
      providesTags: ['Product']
    }),
  }),
});

export const { useGetProductsQuery, useGetRecommendationsQuery } = productApi;
