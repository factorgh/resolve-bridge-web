import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
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
  tagTypes: ["Product"],
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
