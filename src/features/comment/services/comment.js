import axios from '../../../utils/axiosClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Lấy tất cả bình luận
export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async (postId, { rejectWithValue }) => {
    if (!postId) {
      return rejectWithValue('postId không được xác định.'); // Kiểm tra nếu postId không hợp lệ
    }

    try {
      const token = localStorage.getItem('sns_user');
      const response = await axios.get(`/apihost/api/v1/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data || []; // Trả về tất cả bình luận cho bài viết
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Tạo bình luận

export const addComment = createAsyncThunk(
  'comment/createComment',
  async ({ content, userId, postId }, { rejectWithValue }) => {
    try {
      console.log('userId', userId);
      // Kiểm tra nếu có đủ dữ liệu
      if (!postId) {
        return rejectWithValue('ID bài viết không được để trống.');
      }

      // Tạo payload
      const payload = {
        content,
        userId,
        postId,
      };

      // Gửi yêu cầu tạo bình luận
      const response = await axios.post(`/apihost/api/v1/comments`, payload);

      return response.data;

    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);





// Tạo phản hồi cho bình luận
export const addReply = createAsyncThunk(
  'comment/createReply',
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    if (!content) {
      return rejectWithValue('Nội dung phản hồi không được để trống.');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/apihost/api/v1/comments/${commentId}/replies`, { content, postId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Cập nhật bình luận
export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    if (!commentId) {
      return rejectWithValue('commentId không được xác định.');
    }

    if (!content) {
      return rejectWithValue('Nội dung bình luận không được để trống.');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/apihost/api/v1/comments/${commentId}`, { content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// Xóa bình luận
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    if (!commentId) {
      return rejectWithValue('commentId không được xác định.');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/apihost/api/v1/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Đếm số lượng bình luận
export const countComments = createAsyncThunk(
  'comment/countComments',
  async (postId, { rejectWithValue }) => {
    if (!postId) {
      return rejectWithValue('postId không được xác định.');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/apihost/api/v1/posts/${postId}/comments/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Toggle like/unlike bình luận
export const toggleLikeComment = createAsyncThunk(
  'comment/toggleLikeComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/apihost/api/v1/comments/${commentId}/likes`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
