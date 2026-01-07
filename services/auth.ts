import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/auth/`,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthenticationResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    loginUserWithApple: builder.mutation<
      AuthenticationResponse | void,
      AppleSignInRequest
    >({
      query: (body) => ({
        url: "/login-with-apple",
        method: "POST",
        body,
      }),
    }),
    registerUser: builder.mutation<AuthenticationResponse, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    registerUserWithApple: builder.mutation<
      AuthenticationResponse,
      RegisterWithAppleRequest
    >({
      query: (body) => ({
        url: "/register-with-apple",
        method: "POST",
        body,
      }),
    }),
    registerUserWithGoogle: builder.mutation<
      AuthenticationResponse,
      RegisterWithGoogleRequest
    >({
      query: (body) => ({
        url: "/register-with-google",
        method: "POST",
        body,
      }),
    }),
    checkUsernameForNewAccount: builder.query<
      void,
      CheckUsernameForNewAccountRequest
    >({
      query: (body) => ({
        url: "/check-username-for-new-account",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLazyCheckUsernameForNewAccountQuery,
  useRegisterUserMutation,
  useRegisterUserWithGoogleMutation,
  useRegisterUserWithAppleMutation,
  useLoginUserWithAppleMutation,
} = authApi;
