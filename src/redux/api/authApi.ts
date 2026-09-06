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

    userForgotPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-otpByEmail`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userVerifyOTP: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-otp-match`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userResendVerifyOTP: build.mutation<Response, any>({
      query: () => ({
        url: `/otp/resend-email-otp`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userResetPassword: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/forgot-password-reset`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    userGetProfile: build.query<Response, any>({
      query: (params) => ({
        url: `/users/get-user-profile`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.user],
    }),
    userUpdateProfile: build.mutation<Response, any>({
      query: (body) => ({
        url: `/users/update-my-profile`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userPasswordChange: build.mutation<Response, any>({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    //End
  }),
});

export const {
  useUserLoginMutation,
  useUserForgotPasswordMutation,
  useUserVerifyOTPMutation,
  useUserResendVerifyOTPMutation,
  useUserResetPasswordMutation,
  useUserGetProfileQuery,
  useUserUpdateProfileMutation,
  useUserPasswordChangeMutation,
} = authApi;
