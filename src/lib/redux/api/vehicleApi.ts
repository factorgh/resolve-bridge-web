import { baseApi } from './baseApi';

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicVehicles: builder.query<any, void>({
      query: () => '/Vehicles/public',
      providesTags: ['Vehicle'],
    }),
    getPublicVehicle: builder.query<any, string>({
      query: (id) => `/Vehicles/public/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Vehicle', id }],
    }),
    getIntakeLink: builder.query<any, string>({
      query: (token) => `/Vehicles/intake/${token}`,
    }),
    uploadIntakeFiles: builder.mutation<any, { token: string; formData: FormData }>({
      query: ({ token, formData }) => ({
        url: `/Vehicles/intake/${token}/files`,
        method: 'POST',
        body: formData,
      }),
    }),
    submitIntakeVehicle: builder.mutation<any, { token: string; body: any }>({
      query: ({ token, body }) => ({
        url: `/Vehicles/intake/${token}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    adminGetVehicles: builder.query<any, { status?: string } | void>({
      query: (params) => ({
        url: '/Vehicles/admin',
        params: params || undefined,
      }),
      providesTags: ['Vehicle'],
    }),
    adminGetVehicleLinks: builder.query<any, void>({
      query: () => '/Vehicles/admin/links',
      providesTags: ['Vehicle'],
    }),
    adminCreateVehicleLink: builder.mutation<any, any>({
      query: (body) => ({
        url: '/Vehicles/admin/links',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    adminVerifyVehicle: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/Vehicles/admin/${id}/verify`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    adminReleaseVehicle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/Vehicles/admin/${id}/release`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPublicVehiclesQuery,
  useGetPublicVehicleQuery,
  useGetIntakeLinkQuery,
  useUploadIntakeFilesMutation,
  useSubmitIntakeVehicleMutation,
  useAdminGetVehiclesQuery,
  useAdminGetVehicleLinksQuery,
  useAdminCreateVehicleLinkMutation,
  useAdminVerifyVehicleMutation,
  useAdminReleaseVehicleMutation,
} = vehicleApi;
