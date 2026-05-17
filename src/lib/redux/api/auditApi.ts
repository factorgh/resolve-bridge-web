import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AuditLog {
  _id: string;
  adminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  institutionId?: {
    _id: string;
    name: string;
  };
  action: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  updatedAt: string;
}

export const auditApi = createApi({
  reducerPath: 'auditApi',
  tagTypes: ['Audit'],
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
    getAuditLogs: builder.query<{ success: boolean; data: AuditLog[] }, void>({
      query: () => '/Audit',
      providesTags: ['Audit'],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditApi;
