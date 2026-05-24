import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Region {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export const regionApi = createApi({
  reducerPath: 'regionApi',
  tagTypes: ['Region'],
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
    getRegions: builder.query<{ success: boolean; data: Region[] }, void>({
      query: () => '/Regions',
      providesTags: ['Region'],
    }),
  }),
});

export const { useGetRegionsQuery } = regionApi;
