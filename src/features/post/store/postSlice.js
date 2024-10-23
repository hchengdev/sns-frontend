import { createSlice } from '@reduxjs/toolkit';
import {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  searchPosts,
  toggleLikePost,
} from '../services/post';

const initialState = {
  isLoading: false,
  error: '',
  posts: [],
  searchResults: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.error = '';
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getAllPosts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.posts = payload;
      })
      .addCase(getAllPosts.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...action.payload };
        }
      })
      .addCase(updatePost.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(searchPosts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.searchResults = payload;
      })
      .addCase(searchPosts.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(toggleLikePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedPost = action.payload;
        const index = state.posts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          state.posts[index].likeCount = updatedPost.likeCount;
          state.posts[index].likeByUsers = updatedPost.likeByUsers;
        }
      })
      .addCase(toggleLikePost.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { clearMessage, setSearchResults } = postSlice.actions;
export default postSlice.reducer;