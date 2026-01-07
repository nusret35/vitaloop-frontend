import { addictionApi } from "@/services/addiction";
import { chatApi } from "@/services/chat";
import { userApi } from "@/services/user";
import { userAddictionApi } from "@/services/userAddiction";
import { userGoalApi } from "@/services/userGoal";
import { userRoutineApi } from "@/services/userRoutine";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "./slices/authTokenSlice";
import { authApi } from "@/services/auth";
import { supportTicketApi } from "@/services/supportTicket";
import { notificatioApi } from "@/services/notification";
import { createAccountSlice } from "./slices/createAccountSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { dailyFeelingSlice } from "./slices/dailyFeelingSlice";

export const RESET_STORE = "RESET_STORE";

export const resetStore = () => ({
  type: RESET_STORE,
});

const appReducer = combineReducers({
  auth: authSlice.reducer,
  createAccount: createAccountSlice.reducer,
  dailyFeeling: dailyFeelingSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [addictionApi.reducerPath]: addictionApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [userAddictionApi.reducerPath]: userAddictionApi.reducer,
  [userRoutineApi.reducerPath]: userRoutineApi.reducer,
  [userGoalApi.reducerPath]: userGoalApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [supportTicketApi.reducerPath]: supportTicketApi.reducer,
  [notificatioApi.reducerPath]: notificatioApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      addictionApi.middleware,
      userApi.middleware,
      userAddictionApi.middleware,
      userRoutineApi.middleware,
      userGoalApi.middleware,
      chatApi.middleware,
      supportTicketApi.middleware,
      notificatioApi.middleware
    ),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
