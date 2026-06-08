import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/register',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            sessionStorage.setItem('rb_user', JSON.stringify({ ...data.data.user, accessToken: data.data.accessToken }));
            localStorage.setItem('rb_token', data.data.accessToken);
          }
        } catch (err) {}
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/Auth/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            sessionStorage.setItem('rb_user', JSON.stringify({ ...data.data.user, accessToken: data.data.accessToken }));
            localStorage.setItem('rb_token', data.data.accessToken);
            localStorage.setItem('rb_refresh', data.data.refreshToken);
          }
        } catch (err) {}
      },
    }),
    getMe: builder.query({
      query: () => '/Auth/me',
      providesTags: ['User'],
    }),
  }),
  overrideExisting: true,
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
