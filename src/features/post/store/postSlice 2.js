import { createSlice } from '@reduxjs/toolkit';
import {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  searchPosts,
  toggleLikePost, // Import toggleLikePost
} from '../services/post'; // Đảm bảo import các services cần thiết

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
      // Fetch all posts
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
      // Create post
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
      // Delete post
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
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(searchPosts.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.searchResults = payload; // Cập nhật kết quả tìm kiếm
      })
      .addCase(searchPosts.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // Toggle like post
      .addCase(toggleLikePost.pending, (state) => {
        state.isLoading = true; // Thiết lập trạng thái loading khi yêu cầu đang được thực hiện
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        state.isLoading = false; // Đặt trạng thái loading thành false khi hoàn thành
        const updatedPost = action.payload; // Dữ liệu từ API trả về
        const index = state.posts.findIndex(post => post.id === updatedPost.id);
        if (index !== -1) {
          // Cập nhật bài viết trong danh sách
          state.posts[index].likeCount = updatedPost.likeCount; // Cập nhật số lượt thích
          state.posts[index].likeByUsers = updatedPost.likeByUsers; // Cập nhật danh sách người đã thích
        }
      })
      .addCase(toggleLikePost.rejected, (state, { payload }) => {
        state.isLoading = false; // Đặt trạng thái loading thành false khi yêu cầu thất bại
        state.error = payload; // Cập nhật thông báo lỗi
      });
  },
});

export const { clearMessage, setSearchResults } = postSlice.actions;
export default postSlice.reducer;
