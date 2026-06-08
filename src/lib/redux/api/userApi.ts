import { baseApi } from './baseApi';

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

export const userApi = baseApi.injectEndpoints({
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
    adminGetUsers: builder.query<any, string | void>({
      query: (q) => q ? `/Users?q=${encodeURIComponent(q)}` : '/Users',
      providesTags: ['User']
    }),
    adminUpdateUser: builder.mutation<any, { id: string; role?: string; isActive?: boolean; kycStatus?: string }>({
      query: ({ id, ...body }) => ({
        url: `/Users/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    }),
    adminUpdateUserScore: builder.mutation<any, { id: string; customScore?: number; monthlyIncome?: string; employmentStatus?: string }>({
      query: ({ id, ...body }) => ({
        url: `/Users/${id}/score`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    }),
    paySubscription: builder.mutation<any, { phoneNumber: string; carrier: string; pin: string }>({
      query: (body) => ({
        url: '/Users/pay-subscription',
        method: 'POST',
        body
      }),
      invalidatesTags: ['User']
    }),
    b2bGetStaff: builder.query<any, void>({
      query: () => '/Users/b2b/staff',
      providesTags: ['User']
    }),
    b2bOnboardStaff: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Users/b2b/staff',
        method: 'POST',
        body
      }),
      invalidatesTags: ['User']
    }),
    b2bDeboardStaff: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Users/b2b/staff/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),
    b2bUpdateStaffPermissions: builder.mutation<
      any,
      { id: string; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/Users/b2b/staff/${id}/permissions`,
        method: 'PATCH',
        body: { permissions }
      }),
      invalidatesTags: ['User']
    }),
  }),
  overrideExisting: true,
});

export const { 
  useGetMeQuery, 
  useUpdateProfileMutation, 
  useGetDashboardMetricsQuery, 
  useGetNewsArticlesQuery,
  useAdminGetUsersQuery,
  useAdminUpdateUserMutation,
  useAdminUpdateUserScoreMutation,
  usePaySubscriptionMutation,
  useB2bGetStaffQuery,
  useB2bOnboardStaffMutation,
  useB2bDeboardStaffMutation,
  useB2bUpdateStaffPermissionsMutation
} = userApi;
