import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { applicationsReducer } from "./slices/applications";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    applications: applicationsReducer,
  },
});

export default store;
