import { baseApi } from './baseApi';

export const institutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGetInstitutions: builder.query<any, void>({
      query: () => '/institutions/all',
      providesTags: ['Institution'],
    }),
    adminUpdateInstitution: builder.mutation<any, { id: string; isVerified?: boolean; isActive?: boolean; awards?: string[]; promotions?: string[] }>({
      query: ({ id, ...body }) => ({
        url: `/institutions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Institution'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAdminGetInstitutionsQuery,
  useAdminUpdateInstitutionMutation,
} = institutionApi;
