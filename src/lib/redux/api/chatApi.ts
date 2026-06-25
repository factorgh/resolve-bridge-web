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
  institutionId?: {
    _id: string;
    name: string;
    logoUrl?: string;
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
    getChatHistory: builder.query<{ success: boolean; data: MessageItem[] }, { userId?: string; institutionId?: string } | string | void>({
      query: (arg) => {
        if (typeof arg === 'string') {
          return `/Chat/history/${arg}`;
        }
        if (arg && typeof arg === 'object') {
          const { userId, institutionId } = arg;
          const base = userId ? `/Chat/history/${userId}` : "/Chat/history";
          const queryParams = new URLSearchParams();
          if (institutionId) queryParams.append('institutionId', institutionId);
          const qs = queryParams.toString();
          return qs ? `${base}?${qs}` : base;
        }
        return "/Chat/history";
      },
      providesTags: ["Chat"],
    }),
    getAdminConversations: builder.query<{ success: boolean; data: ConversationItem[] }, { isDirect?: boolean } | void>({
      query: (arg) => {
        const isDirect = arg?.isDirect;
        return isDirect ? "/Chat/admin/conversations?isDirect=true" : "/Chat/admin/conversations";
      },
      providesTags: ["Conversation"],
    }),
    sendMessage: builder.mutation<{ success: boolean; data: MessageItem }, { text: string; recipientId?: string; institutionId?: string }>({
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

