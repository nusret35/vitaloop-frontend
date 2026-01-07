import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const addictionApi = createApi({
  reducerPath: "addictionApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/addiction/`,
  }),
  endpoints: (builder) => ({
    getAddictionById: builder.query({
      query: (id) => `${id}`,
    }),
  }),
});
