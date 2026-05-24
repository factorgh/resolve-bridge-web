import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MessageItem {
  _id: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  senderName: string;
  senderRole: string;
  recipientId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  customerId: string;
  customerName: string;
  customerEmail: string;
  latestMessage: string;
  latestTimestamp: string;
  unreadCount: number;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Chat", "Conversation"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("rb_token") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChatHistory: builder.query<{ success: boolean; data: MessageItem[] }, string | void>({
      query: (userId) => (userId ? `/Chat/history/${userId}` : "/Chat/history"),
      providesTags: ["Chat"],
    }),
    getAdminConversations: builder.query<{ success: boolean; data: ConversationItem[] }, void>({
      query: () => "/Chat/admin/conversations",
      providesTags: ["Conversation"],
    }),
    sendMessage: builder.mutation<{ success: boolean; data: MessageItem }, { text: string; recipientId?: string }>({
      query: (body) => ({
        url: "/Chat/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat", "Conversation"],
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useGetAdminConversationsQuery,
  useSendMessageMutation,
} = chatApi;
