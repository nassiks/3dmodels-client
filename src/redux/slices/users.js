import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (params) => {
    const { data } = await axios.patch("/api/users/me", params);
    return data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    profile: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: {
    [updateUserProfile.pending]: (state) => {
      state.status = "loading";
    },
    [updateUserProfile.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.profile = action.payload;
    },
    [updateUserProfile.rejected]: (state) => {
      state.status = "failed";
    },
  },
});

export const usersReducer = usersSlice.reducer;
