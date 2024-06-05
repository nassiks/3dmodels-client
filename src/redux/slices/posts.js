import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ sortType = "new", page = 1, limit = 5, search = "" }) => {
    const { data } = await axios.get(
      `api/posts?sort=${sortType}&page=${page}&limit=${limit}&search=${search}`
    );
    return data;
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("api/posts/tags");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    const { data } = await axios.delete(`api/posts/${id}`);
    return data;
  }
);

export const fetchLikePost = createAsyncThunk("posts/likePost", async (id) => {
  const { data } = await axios.post(`api/posts/${id}/like`);
  return data;
});

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (id) => {
    const { data } = await axios.get(`/api/posts/${id}/comments`);
    return data;
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, text }) => {
    const { data } = await axios.post(`/api/posts/${id}/comments`, { text });
    return data;
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (commentId) => {
    const { data } = await axios.delete(`/api/posts/comments/${commentId}`);
    return { commentId, ...data };
  }
);

export const fetchPostsByTag = createAsyncThunk(
  "posts/fetchPostsByTag",
  async (tag) => {
    const url = `/api/posts/tags/${tag}`;
    const { data } = await axios.get(url);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
    totalPages: 0,
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducer: {},
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload.posts;
      state.posts.totalPages = action.payload.totalPages;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },

    //Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },

    // Лайк статьи
    [fetchLikePost.fulfilled]: (state, action) => {
      const postIndex = state.posts.items.findIndex(
        (post) => post._id === action.payload._id
      );
      if (postIndex !== -1) {
        state.posts.items[postIndex] = action.payload;
      }
    },

    //Комментарии
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },

    // Добавление комментария

    [addComment.fulfilled]: (state, action) => {
      state.comments.items.push(action.payload);
    },

    //Удаление комментария

    [deleteComment.fulfilled]: (state, action) => {
      state.comments.items = state.comments.items.filter(
        (comment) => comment._id !== action.payload.commentId
      );
    },

    //Статьи по тегам

    [fetchPostsByTag.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPostsByTag.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPostsByTag.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
