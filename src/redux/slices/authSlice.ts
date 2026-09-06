// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  role: string;
  // Add other user fields as needed
}

const initialState = {
  accessToken: null as string | null,
  signUpToken: null as string | null,
  resendSignUpToken: null as string | null,
  forgotPasswordToken: null as string | null,
  resendForgotPasswordToken: null as string | null,
  resetPasswordToken: null as string | null,
  userInfo: null as UserInfo | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setSignUpToken: (state, action: PayloadAction<string>) => {
      state.signUpToken = action.payload;
    },
    setResendSignUpToken: (state, action: PayloadAction<string>) => {
      state.resendSignUpToken = action.payload;
    },
    setForgotPasswordToken: (state, action: PayloadAction<string>) => {
      state.forgotPasswordToken = action.payload;
    },
    setResendForgotPasswordToken: (state, action: PayloadAction<string>) => {
      state.resendForgotPasswordToken = action.payload;
    },
    setResetPasswordToken: (state, action: PayloadAction<string>) => {
      state.resetPasswordToken = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
    clearSignUpToken: (state) => {
      state.signUpToken = null;
    },
    clearResendSignUpToken: (state) => {
      state.resendSignUpToken = null;
    },
    clearResetPasswordToken: (state) => {
      state.resetPasswordToken = null;
    },
    clearForgotPasswordToken: (state) => {
      state.forgotPasswordToken = null;
    },
    clearResendForgotPasswordToken: (state) => {
      state.resendForgotPasswordToken = null;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.userInfo = null;
      state.signUpToken = null;
      state.resendSignUpToken = null;
      state.forgotPasswordToken = null;
      state.resetPasswordToken = null;
    },
  },
});

export const {
  setAccessToken,
  setSignUpToken,
  setForgotPasswordToken,
  setResendForgotPasswordToken,
  setResendSignUpToken,
  setResetPasswordToken,
  clearResetPasswordToken,
  clearAccessToken,
  clearSignUpToken,
  clearResendSignUpToken,
  clearResendForgotPasswordToken,
  clearForgotPasswordToken,
  clearAuth,
  setUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
