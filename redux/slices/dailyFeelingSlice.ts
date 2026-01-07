import Feeling from "@/types/feeling";
import { createSlice } from "@reduxjs/toolkit/react";
import * as SecureStore from "expo-secure-store";

export interface DailyFeelingState {
  feeling?: Feeling;
  date?: string;
}

const initialState: DailyFeelingState = {
  feeling: (() => {
    const stored = SecureStore.getItem("FEELING");
    return stored ? (JSON.parse(stored) as Feeling) : undefined;
  })(),
  date: (() => {
    const stored = SecureStore.getItem("DATE");
    return stored || undefined;
  })(),
};

export const dailyFeelingSlice = createSlice({
  name: "dailyFeeling",
  initialState,
  reducers: {
    setFeeling: (state, action) => {
      const { feeling, date } = action.payload;
      state.feeling = feeling;
      SecureStore.setItem("FEELING", JSON.stringify(feeling));
      state.date = date;
      SecureStore.setItem("DATE", date);
    },
    deleteFeeling: (state) => {
      state.feeling = undefined;
      SecureStore.deleteItemAsync("FEELING");
      state.date = undefined;
      SecureStore.deleteItemAsync("DATE");
    },
  },
});

export const { setFeeling, deleteFeeling } = dailyFeelingSlice.actions;
export default dailyFeelingSlice.reducer;
