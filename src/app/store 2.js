import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import postReducer from '../features/post/store/postSlice';
import userReducer from '../features/user/store/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    // search: searchReducer,
  },
});
export default store;
