import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../services/notifications.js';

// Async thunk để lấy thông báo
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchNotifications(userId); // Gọi hàm từ service
      return response; // Hoàn trả dữ liệu
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk để đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsRead(userId); // Gọi hàm từ service
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Tạo slice cho notifications
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload; // Cập nhật notifications
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Xử lý lỗi
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true, // Đánh dấu tất cả thông báo là đã đọc
        }));
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload; // Xử lý lỗi khi đánh dấu là đã đọc
      });
  },
});

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectLoading = (state) => state.notifications.loading;
export const selectError = (state) => state.notifications.error;

// Xuất reducer
export default notificationsSlice.reducer;