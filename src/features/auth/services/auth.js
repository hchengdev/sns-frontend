import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/apihost/api/v1/login', {
        email,
        password,
      });
      if (response.status === 200) {
        window.localStorage.setItem('sns_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          return rejectWithValue('The account has been locked!');
        }
        return rejectWithValue(error.response.data || 'An error occurred!');
      }
      return rejectWithValue('Wrong username or password!');
    }
  }
);

// Đăng ký
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name, birthday, phone }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/apihost/api/v1/register', {
        email,
        password,
        name,
        birthday,
        phone,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Bad credentials!');
    }
  }
);

export const handleGoogleCallback = createAsyncThunk(
  'auth/googleCallback',
  async (code, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/apihost/auth/google/callback?code=${code}`);
      if (response.data) {
        window.localStorage.setItem('sns_user', JSON.stringify(response.data.userDetails));
        return response.data;
      }
      throw new Error('No data returned');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to authenticate with Google.');
      return rejectWithValue('Failed to authenticate with Google.');
    }
  }
);



export default { login, register, handleGoogleCallback };
