import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      any,
      { productType?: string; searchTerm?: string; providerType?: string[] }
    >({
      query: (params) => ({
        url: "/Products/search",
        params,
      }),
      providesTags: ["Product"],
    }),
    getAdminProducts: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/Products",
      providesTags: ["Product"],
    }),
    getBlacklistedProducts: builder.query<
      { success: boolean; data: any[] },
      void
    >({
      query: () => "/Products/blacklisted",
      providesTags: ["Product"],
    }),
    blacklistProduct: builder.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/Products/blacklist/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Product"],
    }),
    restoreProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Products/blacklisted/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product"],
    }),
    getRecommendations: builder.query<any, void>({
      query: () => "/Products/recommendations",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: "/Products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getInstitutions: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/Institutions",
    }),
    createInstitution: builder.mutation<any, any>({
      query: (body) => ({
        url: "/Institutions",
        method: "POST",
        body,
      }),
    }),
    updateInstitution: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Institutions/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProductsQuery,
  useGetAdminProductsQuery,
  useGetBlacklistedProductsQuery,
  useGetRecommendationsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBlacklistProductMutation,
  useRestoreProductMutation,
  useGetInstitutionsQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
} = productApi;
