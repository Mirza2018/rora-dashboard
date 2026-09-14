// src/redux/api/authApi.ts
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

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (body) => ({
        url: `/admin/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userGetProfile: build.query<Response, any>({
      query: () => ({
        url: `/admin/profile`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    userUpdateProfile: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/profile/update`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userPasswordChange: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userForgotPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/forget-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userVerifyOTP: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/verify-reset-otp`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userResendVerifyOTP: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/resend-otp`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userResetPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/admin/reset-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    //

    //End
  }),
});

export const {
  useUserLoginMutation,
  useUserPasswordChangeMutation,
  useUserGetProfileQuery,
  useUserUpdateProfileMutation,
  useUserForgotPasswordMutation,
  useUserVerifyOTPMutation,
  useUserResendVerifyOTPMutation,
  useUserResetPasswordMutation,
} = authApi;
