import { baseApi } from './baseApi';

export interface NotificationItem {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  targetId?: string;
  createdAt: string;
  updatedAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      { success: boolean; data: NotificationItem[] },
      void
    >({
      query: () => "/Notifications/mine",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<
      { success: boolean; data: NotificationItem },
      string
    >({
      query: (id) => ({
        url: `/Notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationApi;
