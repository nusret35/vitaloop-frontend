import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const notificatioApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/notifications`,
  }),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<AppNotification[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
    getNotificationById: builder.query<AppNotification, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateSeenStatus: builder.mutation<
      void,
      NotificationSeenStatusUpdateRequest
    >({
      query: (body) => ({
        url: "/update-seen",
        body,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useUpdateSeenStatusMutation,
} = notificatioApi;
