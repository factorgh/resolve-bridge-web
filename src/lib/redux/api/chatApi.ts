import { baseApi } from './baseApi';

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

export const chatApi = baseApi.injectEndpoints({
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
  overrideExisting: true,
});

export const {
  useGetChatHistoryQuery,
  useGetAdminConversationsQuery,
  useSendMessageMutation,
} = chatApi;
