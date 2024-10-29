import axios from '../../../utils/axiosClient';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get('/apihost/api/v1/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/apihost/api/v1/me/posts?content=${searchTerm}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const createPost = createAsyncThunk(
  'post/create',
  async ({content, userId, visibility, file}, {rejectWithValue}) => {
    try {
      console.log('userId', userId);
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', userId);
      formData.append('visibility', visibility);
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('/apihost/api/v1/posts', formData);
      return response.data;

    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const updatePost = createAsyncThunk(
  'post/update',
  async ({postId, content, visibility, media}, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('visibility', visibility);
      media.forEach((file) => formData.append('file', file)); // Ghi lại tất cả media

      const {token} = JSON.parse(window.localStorage.getItem('sns_user'));
      if (!token) {
        return rejectWithValue('Bạn cần đăng nhập để thực hiện hành động này.');
      }

      const response = await axios.put(`/apihost/api/v1/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || 'Đã xảy ra lỗi không xác định.'
        );
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định.');
    }
  },
);


export const deletePost = createAsyncThunk(
  'post/delete',
  async (postId, {rejectWithValue}) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/apihost/api/v1/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return postId;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const toggleLikePost = createAsyncThunk(
  'post/toggleLikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      // Gửi yêu cầu PUT tới API để thích hoặc bỏ thích bài viết
      const response = await axios.put(`/apihost/api/v1/posts/${postId}/likes`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Trả về dữ liệu phản hồi từ API
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);
