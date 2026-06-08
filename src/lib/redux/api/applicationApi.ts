import { baseApi } from './baseApi';

export const applicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query<any, void>({
      query: () => "/Applications/my-applications",
      providesTags: ["Application"],
    }),
    createApplication: builder.mutation<any, any>({
      query: (body) => ({
        url: "/Applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application"],
    }),
    adminGetApplications: builder.query<any, { status?: string; assignedTo?: string } | void>({
      query: (params) => ({
        url: "/Applications/admin",
        params: params || undefined,
      }),
      providesTags: ["Application"],
    }),
    adminAssignApplication: builder.mutation<
      any,
      { id: string; assignedTo: string | null }
    >({
      query: ({ id, assignedTo }) => ({
        url: `/Applications/admin/${id}/assign`,
        method: "PATCH",
        body: { assignedTo },
      }),
      invalidatesTags: ["Application"],
    }),
    adminReviewApplication: builder.mutation<
      any,
      { id: string; status: string; rejectionReason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/Applications/admin/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Application"],
    }),
    adminRestoreApplication: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Applications/admin/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Application"],
    }),
    adminToggleReminderFlag: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Applications/admin/${id}/toggle-reminder-flag`,
        method: "PATCH",
      }),
      invalidatesTags: ["Application"],
    }),
    adminTriggerReminders: builder.mutation<any, void>({
      query: () => ({
        url: "/Applications/admin/trigger-reminders",
        method: "POST",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useAdminGetApplicationsQuery,
  useAdminAssignApplicationMutation,
  useAdminReviewApplicationMutation,
  useAdminRestoreApplicationMutation,
  useAdminToggleReminderFlagMutation,
  useAdminTriggerRemindersMutation,
} = applicationApi;
