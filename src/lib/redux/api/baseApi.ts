import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { encrypt, decrypt } from '../../encryption';

const rawBaseQuery = fetchBaseQuery({ 
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1',
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rb_token') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const encryptedBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const encryptionKey = process.env.NEXT_PUBLIC_PAYLOAD_ENCRYPTION_KEY;
  if (!encryptionKey) {
    return rawBaseQuery(args, api, extraOptions);
  }

  let adjustedArgs = typeof args === 'string' ? { url: args } : { ...args };

  // Skip encryption for FormData / non-JSON bodies
  const isMultipart = adjustedArgs.body instanceof FormData;
  const isJson = adjustedArgs.body && typeof adjustedArgs.body === 'object' && !isMultipart;

  if (isJson) {
    try {
      const plaintext = JSON.stringify(adjustedArgs.body);
      const cipher = await encrypt(plaintext, encryptionKey);
      
      adjustedArgs.body = { payload: cipher };
      adjustedArgs.headers = {
        ...adjustedArgs.headers,
        'Content-Type': 'application/json',
        'X-Payload-Encrypted': 'true',
      };
    } catch (err) {
      console.error('[Error] Request encryption failed:', err);
    }
  } else if (!isMultipart) {
    // For GET/HEAD requests, still let the backend know we support payload encryption for responses
    adjustedArgs.headers = {
      ...adjustedArgs.headers,
      'X-Payload-Encrypted': 'true',
    };
  }

  const result = await rawBaseQuery(adjustedArgs, api, extraOptions);

  if (result.data) {
    const responseData = result.data as any;
    if (responseData && responseData.payload) {
      try {
        const decryptedText = await decrypt(responseData.payload, encryptionKey);
        result.data = JSON.parse(decryptedText);
      } catch (err) {
        console.error('[Error] Response decryption failed:', err);
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: 'Secure communication channel decryption failure.',
            data: null,
          },
        };
      }
    }
  }

  if (result.error && result.error.data) {
    const errorData = result.error.data as any;
    if (errorData && errorData.payload) {
      try {
        const decryptedText = await decrypt(errorData.payload, encryptionKey);
        result.error.data = JSON.parse(decryptedText);
      } catch (err) {
        console.error('[Error] Error payload decryption failed:', err);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: encryptedBaseQuery,
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
