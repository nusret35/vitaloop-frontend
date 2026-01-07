import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/ai/chat`,
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getMessages: builder.query<MessagesResponse, GetMessagesRequest>({
      keepUnusedDataFor: 0,
      query: (params) => ({
        url: `/messages${params.before ? `?before=${params.before}` : ""}`,
        method: "GET",
      }),
    }),
    fetchRelapseSupport: builder.mutation<ChatMessage, string>({
      query: (addictionId) => ({
        url: "/chat-about-to-relapse",
        body: { addictionId },
        method: "POST",
      }),
    }),
    sendMessage: builder.mutation<ChatMessage, UserMessage>({
      query: (userMessage) => ({
        url: "/send-message",
        body: { ...userMessage },
        method: "POST",
      }),
    }),
    fetchFeelingSupport: builder.mutation<ChatMessage, DailyFeelingRequest>({
      query: (body) => ({
        url: "/chat-feeling",
        body,
        method: "POST",
      }),
    }),
    fetchGreetUser: builder.mutation<ChatMessage, void>({
      query: () => ({
        url: "/greet-user",
        method: "POST",
      }),
    }),
    fetchIsLimitReached: builder.query<boolean, void>({
      keepUnusedDataFor: 0,
      query: () => ({
        url: "/is-limit-reached",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useFetchRelapseSupportMutation,
  useFetchFeelingSupportMutation,
  useFetchGreetUserMutation,
  useFetchIsLimitReachedQuery,
} = chatApi;
