import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name, birthday, phone }, { rejectWithValue }) => {
    try {
      // TODO: un-comment these when api is done
      const response = await axios.post('/apihost/api/v1/register', {
        email,
        password,
        name,
        birthday,
        phone,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue('bad credentials!');
    }
  },
);

export default { login, register };
