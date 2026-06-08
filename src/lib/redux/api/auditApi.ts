import { baseApi } from './baseApi';

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

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<{ success: boolean; data: AuditLog[] }, void>({
      query: () => '/Audit',
      providesTags: ['Audit'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAuditLogsQuery } = auditApi;
