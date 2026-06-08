import { baseApi } from './baseApi';

export interface Region {
  _id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export const regionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRegions: builder.query<{ success: boolean; data: Region[] }, void>({
      query: () => '/Regions',
      providesTags: ['Region'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetRegionsQuery } = regionApi;
