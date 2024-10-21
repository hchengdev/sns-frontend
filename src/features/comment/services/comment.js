import axios from '../../../utils/axiosClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async (postId, { rejectWithValue }) => {
    if (!postId) return rejectWithValue('postId không được xác định.');

    try {
      const token = localStorage.getItem('sns_user');
      const response = await axios.get(`/apihost/api/v1/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/createComment',
  async ({ content, userId, postId }, { rejectWithValue }) => {
    if (!postId) return rejectWithValue('ID bài viết không được để trống.');

    const payload = { content, userId, postId };

    try {
      const response = await axios.post(`/apihost/api/v1/comments`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const addReply = createAsyncThunk(
  'comment/createReply',
  async ({ postId, content, userId, commentId }, { rejectWithValue }) => {
    if (!postId || !userId || !commentId) {
      return rejectWithValue('ID comment, post hoặc user không được để trống.');
    }

    const token = localStorage.getItem('sns_user');
    if (!token) return rejectWithValue('Token không hợp lệ.');

    const payload = { content, userId, postId };

    try {
      const response = await axios.post(
        `/apihost/api/v1/comments/${commentId}/replies`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Lỗi không xác định.');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    if (!commentId) return rejectWithValue('commentId không được xác định.');
    if (!content) return rejectWithValue('Nội dung bình luận không được để trống.');

    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `/apihost/api/v1/comments/${commentId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    if (!commentId) return rejectWithValue('commentId không được xác định.');

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/apihost/api/v1/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const countComments = createAsyncThunk(
  'comment/countComments',
  async (postId, { rejectWithValue }) => {
    if (!postId) return rejectWithValue('postId không được xác định.');

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/apihost/api/v1/posts/${postId}/comments/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  'comment/toggleLikeComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/apihost/api/v1/comments/${commentId}/likes`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
