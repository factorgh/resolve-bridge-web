import { baseApi } from './baseApi';

export interface BillingInvoice {
  _id: string;
  institutionId: {
    _id: string;
    name: string;
    type: string;
    email: string;
    logoUrl?: string;
  };
  amount: number;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue";
  reference: string;
  billingDate: string;
  paidAt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingFeePlan {
  _id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "annually";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionBillingProfile {
  _id: string;
  name: string;
  legalName: string;
  type: string;
  email: string;
  logoUrl?: string;
  isActive: boolean;
  subscriptionFee: number;
  billingCycle: "monthly" | "annually";
  billingStatus: "Active" | "Delinquent" | "Unpaid";
  nextBillingDate: string;
  lastBillingDate: string;
  unpaidBalance: number;
}

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<
      { success: boolean; data: BillingInvoice[] },
      void
    >({
      query: () => "/Billing/invoices",
      providesTags: ["Billing"],
    }),
    getInstitutionsBilling: builder.query<
      { success: boolean; data: InstitutionBillingProfile[] },
      void
    >({
      query: () => "/Billing/institutions",
      providesTags: ["Institution"],
    }),
    updateSubscriptionFee: builder.mutation<
      { success: boolean; data: any },
      {
        id: string;
        subscriptionFee?: number;
        billingCycle?: string;
        billingStatus?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/Billing/institutions/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Institution"],
    }),
    getFeePlans: builder.query<
      { success: boolean; data: BillingFeePlan[] },
      void
    >({
      query: () => "/Billing/plans",
      providesTags: ["Billing"],
    }),
    createFeePlan: builder.mutation<
      { success: boolean; data: BillingFeePlan },
      {
        name: string;
        description: string;
        amount: number;
        currency: string;
        billingCycle: string;
        isActive: boolean;
      }
    >({
      query: (body) => ({
        url: "/Billing/plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Billing"],
    }),
    updateFeePlan: builder.mutation<
      { success: boolean; data: BillingFeePlan },
      {
        id: string;
        name?: string;
        description?: string;
        amount?: number;
        currency?: string;
        billingCycle?: string;
        isActive?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/Billing/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Billing"],
    }),
    deleteFeePlan: builder.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/Billing/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Billing"],
    }),
    applyFeePlanToInstitution: builder.mutation<
      { success: boolean; data: any },
      { planId: string; institutionId: string }
    >({
      query: ({ planId, institutionId }) => ({
        url: `/Billing/plans/${planId}/apply/${institutionId}`,
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Institution"],
    }),
    createInvoice: builder.mutation<
      { success: boolean; data: BillingInvoice },
      {
        institutionId: string;
        amount: number;
        description?: string;
        dueDate?: string;
      }
    >({
      query: (body) => ({
        url: "/Billing/invoices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Billing", "Institution"],
    }),
    payInvoice: builder.mutation<
      { success: boolean; data: BillingInvoice },
      string
    >({
      query: (id) => ({
        url: `/Billing/invoices/${id}/pay`,
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Institution"],
    }),
    initializeInvoicePayment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Billing/invoices/${id}/initialize-payment`,
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Institution"],
    }),
    triggerBillingRun: builder.mutation<
      { success: boolean; data: { count: number } },
      void
    >({
      query: () => ({
        url: "/Billing/trigger-run",
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Institution"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetInvoicesQuery,
  useGetInstitutionsBillingQuery,
  useGetFeePlansQuery,
  useCreateFeePlanMutation,
  useUpdateFeePlanMutation,
  useDeleteFeePlanMutation,
  useApplyFeePlanToInstitutionMutation,
  useUpdateSubscriptionFeeMutation,
  useCreateInvoiceMutation,
  usePayInvoiceMutation,
  useInitializeInvoicePaymentMutation,
  useTriggerBillingRunMutation,
} = billingApi;
