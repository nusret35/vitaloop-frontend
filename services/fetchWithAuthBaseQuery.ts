import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "@/redux/store";
import { logOut, setAuthToken } from "@/redux/slices/authTokenSlice";

const fetchWithAuthBaseQuery = ({ baseUrl }: { baseUrl: string }) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", token);
      }

      return headers;
    },
  });
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery(
        "/refresh-token",
        api,
        extraOptions
      );
      if (refreshResult.data) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    }
    return result;
  };
  return baseQueryWithReauth;
};

export default fetchWithAuthBaseQuery;
