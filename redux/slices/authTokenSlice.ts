import { removeToken } from "@/storage/tokenStorage";
import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

export interface AuthTokenState {
  token?: string;
}

const initialState: AuthTokenState = {
  token: SecureStore.getItem("RECOVERAI_AUTH_TOKEN") ?? undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      const token = `Bearer ${action.payload}`;
      state.token = token;
      SecureStore.setItem("RECOVERAI_AUTH_TOKEN", token);
    },
    logOut: (state) => {
      state.token = undefined;
      removeToken();
      SecureStore.deleteItemAsync("RECOVERAI_AUTH_TOKEN");
    },
    logIn: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setAuthToken, logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
