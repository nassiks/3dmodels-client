import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const createApplication = createAsyncThunk(
  "applications/createApplication",
  async () => {
    const { data } = await axios.post("/api/applications");
    return data;
  }
);

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async () => {
    const { data } = await axios.get("/api/applications");
    return data;
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async (params) => {
    const { data } = await axios.patch("/api/applications", params);
    return data;
  }
);

export const fetchResearchers = createAsyncThunk(
  "applications/fetchResearchers",
  async () => {
    const { data } = await axios.get("/api/users/researchers");
    return data;
  }
);

export const updateUserRole = createAsyncThunk(
  "applications/updateUserRole",
  async ({ userId, role }) => {
    const { data } = await axios.patch(`/api/users/${userId}/role`, { role });
    return data;
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    items: [],
    researchers: [],
    status: "idle",
  },
  reducers: {
    removeResearcher(state, action) {
      state.researchers = state.researchers.filter(
        (researcher) => researcher._id !== action.payload
      );
    },
  },
  extraReducers: {
    [createApplication.fulfilled]: (state, action) => {
      state.items.push(action.payload);
    },
    [fetchApplications.fulfilled]: (state, action) => {
      state.items = action.payload;
    },
    [updateApplicationStatus.fulfilled]: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    [fetchResearchers.fulfilled]: (state, action) => {
      state.researchers = action.payload;
    },
    [updateUserRole.fulfilled]: (state, action) => {
      state.researchers = state.researchers.filter(
        (researcher) => researcher._id !== action.payload._id
      );
    },
  },
});

export const { removeResearcher } = applicationsSlice.actions;
export const applicationsReducer = applicationsSlice.reducer;
