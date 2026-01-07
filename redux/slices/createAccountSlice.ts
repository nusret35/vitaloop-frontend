import { createSlice } from "@reduxjs/toolkit";

export interface CreateAccountSlice {
  username: string;
  password: string;
  name: string;
  surname: string;
  appleId: string;
}

const initialState: CreateAccountSlice = {
  username: "",
  password: "",
  name: "",
  surname: "",
  appleId: "",
};

export const createAccountSlice = createSlice({
  name: "create-account",
  initialState,
  reducers: {
    setNameAndSurname: (state, action) => {
      state.name = action.payload.name;
      state.surname = action.payload.surname;
    },
    setCreateAccountCredentials: (state, action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    setAppleId: (state, action) => {
      state.appleId = action.payload;
    },
  },
});

export const { setNameAndSurname, setCreateAccountCredentials, setAppleId } =
  createAccountSlice.actions;

export default createAccountSlice.reducer;
