import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getTokenFromLocalStorage = () => {
  const user = window.localStorage.getItem('sns_user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.token;
  }
  return null;
};

const updateUser = async (user) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.put(`/apihost/api/v1/me`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('User updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error during user update:', error);
    toast.error('Error updating user');
    throw error;
  }
};

const getUser = async () => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error('Error fetching user data');
    throw error;
  }
};
const getUsers = async ({ name }) => {
  if (!name) {
    throw new Error('Name parameter is required');
  }

  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/findUsers/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    toast.error('Error fetching user data');
    throw error;
  }
};

const getUsersById = async ({ id }) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error('Error fetching user data');
    throw error;
  }
};

const updatePassWord = createAsyncThunk(
  'user/update-password',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      toast.error('No authentication token found');
      return rejectWithValue('No authentication token');
    }

    try {
      const response = await axios.put(
        `/apihost/api/v1/me/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success('Passwords updated successfully');
        return response.data;
      }
    } catch (error) {
      toast.error('Incorrect password');
      return rejectWithValue(error.response?.data.errors[0] || 'Update failed');
    }
  },
);

export const getUserByName = createAsyncThunk(
  'user/getUserByName',
  async ({ name }, { rejectWithValue }) => {
    const token = getTokenFromLocalStorage();
    try {
      const response = await axios.get(
        `/apihost/api/v1/user?username=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      toast.error('Error fetching user data');
      return rejectWithValue(error.response.data);
    }
  },
);

export default {
  updateUser,
  getUser,
  getUsers,
  updatePassWord,
  getUsersById,
  getUserByName,
};
