import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
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
  tagTypes: [
    'User',
    'Product',
    'Application',
    'Document',
    'Subscription',
    'SubscriptionPlan',
    'Transaction',
    'Institution',
    'Audit',
    'Payment',
    'Notification',
    'Region',
    'Chat',
    'Conversation',
    'Analytics',
    'Billing'
  ],
  endpoints: () => ({}),
});
