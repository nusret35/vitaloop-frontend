import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const supportTicketApi = createApi({
  reducerPath: "supportTicketApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/support-ticket`,
  }),
  endpoints: (builder) => ({
    sendSupportTicket: builder.mutation<void, SupportTicketRequest>({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendSupportTicketMutation } = supportTicketApi;
