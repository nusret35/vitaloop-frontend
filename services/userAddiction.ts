import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const userAddictionApi = createApi({
  reducerPath: "userAddictionApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/user-addiction`,
  }),
  tagTypes: ["Addiction"],
  endpoints: (builder) => ({
    getUserAddictions: builder.query<UserAddiction[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Addiction"],
    }),
    createUserAddiction: builder.mutation<void, AddUserAddictionRequest>({
      query: (addictionData) => ({
        url: "create",
        method: "POST",
        body: addictionData,
      }),
      invalidatesTags: ["Addiction"],
    }),
    getUserAddictionById: builder.query<UserAddiction, string>({
      query: (addictionId) => ({
        url: `/${addictionId}`,
        method: "GET",
      }),
      providesTags: ["Addiction"],
    }),
    deleteUserAddictionById: builder.mutation<void, DeleteUserAddictionRequest>(
      {
        query: (body) => ({
          url: "/delete",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Addiction"],
      }
    ),
    resetTimer: builder.mutation<
      ResetTimerResponse,
      ResetAddictionTimerRequest
    >({
      query: (body) => ({
        url: "/reset-timer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Addiction"],
    }),
    getAllAddictions: builder.query<Addiciton[], void>({
      query: () => ({
        url: "all-addictions",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserAddictionsQuery,
  useCreateUserAddictionMutation,
  useGetUserAddictionByIdQuery,
  useDeleteUserAddictionByIdMutation,
  useResetTimerMutation,
  useGetAllAddictionsQuery,
  useLazyGetAllAddictionsQuery,
} = userAddictionApi;
