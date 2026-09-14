// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";
import { getBaseUrl } from "../getBaseUrl";
import { RootState } from "../store"; // Import RootState from store.ts

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const signUpToken = state.auth.signUpToken;
    const resendSignUpToken = state.auth.resendSignUpToken;
    const forgotPassToken = state.auth.forgotPasswordToken;
    const resendForgotPasswordToken = state.auth.resendForgotPasswordToken;
    const resetPasswordToken = state.auth.resetPasswordToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // if (forgotPassToken) {
    //   headers.set("signUpToken", `signUpToken ${forgotPassToken}`);
    // }
    // if (resendForgotPasswordToken) {
    //   headers.set("signUpToken", `signUpToken ${resendForgotPasswordToken}`);
    // }
    // if (signUpToken) {
    //   headers.set("authorization", `Bearer ${signUpToken}`);
    // }
    // if (resendSignUpToken) {
    //   headers.set("authorization", `Bearer ${resendSignUpToken}`);
    // }

    if (resetPasswordToken) {
      headers.set("reset-token", `${resetPasswordToken}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
