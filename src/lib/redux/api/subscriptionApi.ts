import { baseApi } from './baseApi';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium' | 'elite';
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  maxLoans: number;
  maxApplications: number;
  prioritySupport: boolean;
  advisorAccess: boolean;
  fraudProtection: boolean;
  investmentInsights: boolean;
  businessTools: boolean;
  educationCourses: boolean;
  debtDashboard: boolean;
  vipConcierge: boolean;
  eligibilityChecker: boolean;
  creditMonitoring: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumFeatures {
  creditMonitoring: boolean;
  eligibilityChecker: boolean;
  advisorAccess: boolean;
  fraudProtection: boolean;
  investmentInsights: boolean;
  businessTools: boolean;
  educationCourses: boolean;
  debtDashboard: boolean;
  vipConcierge: boolean;
  prioritySupport: boolean;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscription plans
    getSubscriptionPlans: builder.query<{ success: boolean; data: SubscriptionPlan[] }, void>({
      query: () => '/Subscriptions/plans',
      providesTags: ['SubscriptionPlan']
    }),

    // Get single subscription plan
    getSubscriptionPlan: builder.query<{ success: boolean; data: SubscriptionPlan }, string>({
      query: (id) => `/Subscriptions/plans/${id}`,
      providesTags: ['SubscriptionPlan']
    }),

    // Get user's current subscription
    getUserSubscription: builder.query<{ success: boolean; data: SubscriptionPlan | null }, void>({
      query: () => '/Subscriptions/me/subscription',
      providesTags: ['Subscription']
    }),

    // Get user's premium features
    getPremiumFeatures: builder.query<{ success: boolean; data: PremiumFeatures }, void>({
      query: () => '/Subscriptions/me/features',
      providesTags: ['Subscription']
    }),

    // Upgrade subscription
    upgradeSubscription: builder.mutation<{ success: boolean; data: any }, { planId: string }>({
      query: (body) => ({
        url: '/Subscriptions/me/upgrade',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Subscription']
    }),

    // Create subscription plan (admin)
    createSubscriptionPlan: builder.mutation<{ success: boolean; data: SubscriptionPlan }, Partial<SubscriptionPlan>>({
      query: (body) => ({
        url: '/Subscriptions/plans',
        method: 'POST',
        body
      }),
      invalidatesTags: ['SubscriptionPlan']
    }),

    // Update subscription plan (admin)
    updateSubscriptionPlan: builder.mutation<{ success: boolean; data: SubscriptionPlan }, { id: string; body: Partial<SubscriptionPlan> }>({
      query: ({ id, body }) => ({
        url: `/Subscriptions/plans/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['SubscriptionPlan']
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionPlanQuery,
  useGetUserSubscriptionQuery,
  useGetPremiumFeaturesQuery,
  useUpgradeSubscriptionMutation,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} = subscriptionApi;
