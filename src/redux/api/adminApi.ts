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

    // Disputes
    getDisputesStar: build.query<Response, any>({
      query: (params) => ({
        url: `/disputes/stats`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.disputes],
    }),
    getAllDisputes: build.query<Response, any>({
      query: (params) => ({
        url: `/disputes`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.disputes],
    }),
    resolveDispute: build.mutation({
      query: (body) => ({
        url: `/disputes/${body.id}/resolve`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.disputes],
    }),
    rejectDispute: build.mutation({
      query: (body) => ({
        url: `/disputes/${body.id}/reject`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.disputes],
    }),

    ///Payout

    getPayoutStar: build.query<Response, any>({
      query: () => ({
        url: `/payout/admin/stats`,
        method: "GET",
      }),
      providesTags: [tagTypes.payout],
    }),

    getAllPayout: build.query<Response, any>({
      query: (params) => ({
        url: `/payout/admin`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.payout],
    }),
    approvePayout: build.mutation({
      query: (id) => ({
        url: `/payout/admin/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.payout],
    }),
    markPayout: build.mutation({
      query: (id) => ({
        url: `/payout/admin/${id}/mark-paid`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.payout],
    }),
    rejectPayout: build.mutation({
      query: (body) => ({
        url: `/payout/admin/${body.id}/reject`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.payout],
    }),

    ///Notifications

    createNotification: build.mutation<Response, any>({
      query: (body) => ({
        url: `/notifications/admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.notification],
    }),
    getNotifications: build.query<Response, any>({
      query: (params) => ({
        url: `/notifications/admin`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.notification],
    }),

    //calls
    getCalls: build.query<Response, any>({
      query: (params) => ({
        url: `/calls/admin`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.calls],
    }),
    getCallStat: build.query<Response, any>({
      query: () => ({
        url: `/calls/admin/stats`,
        method: "GET",
      }),
      providesTags: [tagTypes.calls],
    }),

    ////Customers

    getCustomers: build.query<Response, any>({
      query: (params) => ({
        url: `/users/admin`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.customers],
    }),
    getCustomerstat: build.query<Response, any>({
      query: () => ({
        url: `/users/admin/stats`,
        method: "GET",
      }),
      providesTags: [tagTypes.customers],
    }),
    getCustomerDetails: build.query<Response, any>({
      query: (id) => ({
        url: `/users/admin/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.customers],
    }),

    transferMinute: build.mutation<Response, any>({
      query: (body) => ({
        url: `/wallet/admin/${body.id}/transfer`,
        method: "POST",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.customers],
    }),
    markDistributor: build.mutation<Response, any>({
      query: (body) => ({
        url: `/users/admin/${body.id}/mark-distributor`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.customers],
    }),
    suspendCustomer: build.mutation<Response, any>({
      query: (body) => ({
        url: `/users/admin/${body.id}/suspend`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.customers],
    }),
    activeCustomer: build.mutation<Response, any>({
      query: (id) => ({
        url: `/users/admin/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.customers],
    }),
    //pricing

    getDestinations: build.query<Response, any>({
      query: (params) => ({
        url: `/destinations/admin/`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.destinations],
    }),

    createDestination: build.mutation<Response, any>({
      query: (body) => ({
        url: `/destinations/admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.destinations],
    }),
    editDestination: build.mutation<Response, any>({
      query: (body) => ({
        url: `/destinations/admin/${body.id}`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.destinations],
    }),
    updateDestinationSatus: build.mutation<Response, any>({
      query: (body) => ({
        url: `/destinations/admin/${body.id}/status`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.destinations],
    }),
    deleteDestination: build.mutation<Response, any>({
      query: (id) => ({
        url: `/destinations/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.destinations],
    }),
    //Operators

    getOperators: build.query<Response, any>({
      query: (params) => ({
        url: `/operator/admin`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.operators],
    }),
    getOperatorstat: build.query<Response, any>({
      query: () => ({
        url: `/operator/admin/stats`,
        method: "GET",
      }),
      providesTags: [tagTypes.operators],
    }),
    verifyOperator: build.mutation<Response, any>({
      query: (id) => ({
        url: `/operator/admin/${id}/verify`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.operators],
    }),

    suspendOperator: build.mutation<Response, any>({
      query: (body) => ({
        url: `/operator/admin/${body.id}/suspend`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.operators],
    }),
    activeOperator: build.mutation<Response, any>({
      query: (id) => ({
        url: `/operator/admin/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.operators],
    }),

    inviteOperator: build.mutation<Response, any>({
      query: (body) => ({
        url: `/operator/admin/invite`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.operators],
    }),

    ///Distributors Report

    getDistributors: build.query<Response, any>({
      query: () => ({
        url: `/wallet/admin/distributors/report`,
        method: "GET",
      }),
      // providesTags: [tagTypes.customers],
    }),
    getDistributorsTransfer: build.query<Response, any>({
      query: (params) => ({
        url: `/wallet/admin/distributors/transfers`,
        method: "GET",
        params,
      }),
      // providesTags: [tagTypes.customers],
    }),
    getOverview: build.query<Response, any>({
      query: () => ({
        url: `/admin/dashboard`,
        method: "GET",
      }),
      // providesTags: [tagTypes.customers],
    }),
    ///
    getPolicyAndHelp: build.query<Response, any>({
      query: () => ({
        url: `/admin/policy`,
        method: "GET",
      }),
      providesTags: [tagTypes.policy],
    }),

    updatePolicyAndHelp: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/policy/${body.type}`,
        method: "POST",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.policy],
    }),

    // end
  }),
});

export const {
  useGetAnalysisQuery,
  ///Disputes
  useGetDisputesStarQuery,
  useGetAllDisputesQuery,
  useResolveDisputeMutation,
  useRejectDisputeMutation,

  //Payout

  useGetPayoutStarQuery,
  useGetAllPayoutQuery,
  useApprovePayoutMutation,
  useMarkPayoutMutation,
  useRejectPayoutMutation,
  useLazyGetAllPayoutQuery,

  //Notifications

  useCreateNotificationMutation,
  useLazyGetNotificationsQuery,
  useGetNotificationsQuery,

  //Calls
  useLazyGetCallsQuery,
  useGetCallsQuery,
  useGetCallStatQuery,

  //Customers

  useGetCustomersQuery,
  useGetCustomerstatQuery,
  useGetCustomerDetailsQuery,
  useTransferMinuteMutation,
  useMarkDistributorMutation,
  useSuspendCustomerMutation,
  useActiveCustomerMutation,
  useLazyGetCustomersQuery,

  //Pricing

  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useEditDestinationMutation,
  useUpdateDestinationSatusMutation,
  useDeleteDestinationMutation,

  //Operators

  useGetOperatorsQuery,
  useGetOperatorstatQuery,
  useVerifyOperatorMutation,
  useSuspendOperatorMutation,
  useActiveOperatorMutation,
  useInviteOperatorMutation,
  ///

  useGetDistributorsQuery,
  useGetDistributorsTransferQuery,
  useGetOverviewQuery,
  //
  useGetPolicyAndHelpQuery,
  useUpdatePolicyAndHelpMutation,
} = adminApi;
