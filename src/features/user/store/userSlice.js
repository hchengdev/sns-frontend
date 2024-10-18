import { createSlice } from '@reduxjs/toolkit';
import { getUserByName } from '../services/user';
import { mutualFriends } from '../../../features/friend/services/friend';
const initialState = {
  listUser: [],
  isLoading: false,
  error: '',
  mutualFriendsList: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearListUser: (state) => {
      state.listUser = [];
      state.isLoading = false;
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByName.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getUserByName.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.listUser = payload;
      })
      .addCase(getUserByName.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(mutualFriends.fulfilled, (state, { payload }) => {
        state.mutualFriendsList[payload.id] = payload.mutualFriends;
      })
      .addCase(mutualFriends.rejected, (state, { payload }) => {
        state.mutualFriendsList[payload.id] = 0;
      });
  },
});
export const { clearListUser } = userSlice.actions;
export default userSlice.reducer;
