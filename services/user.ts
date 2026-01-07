import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<void, UpdateUserRequest>({
      query: (body) => ({
        url: "user/update-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<
      AuthenticationResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "user/change-password",
        method: "POST",
        body,
      }),
    }),
    setDailyFeeling: builder.mutation<void, DailyFeelingRequest>({
      query: (body) => ({
        url: "user/log-daily-feeling",
        method: "POST",
        body,
      }),
    }),
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: "user/delete-user",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useSetDailyFeelingMutation,
  useDeleteUserMutation,
} = userApi;
