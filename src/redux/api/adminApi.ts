import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

interface Filter {
  page?: number;
  limit?: number;
  search?: string;
}
interface Response {
  data: any | void;
}
export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalysis: build.query<Response, any>({
      query: (params) => ({
        url: `/admin/analytics`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.analysis],
    }),

    // end
  }),
});

export const { useGetAnalysisQuery } = adminApi;
