import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../services/notifications.js';

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchNotifications(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsRead(userId);
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

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
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        }));
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectNotifications = (state) => state.notifications.notifications;
export const selectLoading = (state) => state.notifications.loading;
export const selectError = (state) => state.notifications.error;

export default notificationsSlice.reducer;