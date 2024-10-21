import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import postReducer from '../features/post/store/postSlice';
import userReducer from '../features/user/store/userSlice';
import notificationsReducer from '../features/notifications/store/notificationsSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    notifications: notificationsReducer,

  },
});
export default store;
