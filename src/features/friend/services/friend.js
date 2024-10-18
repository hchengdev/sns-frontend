import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const getTokenFromLocalStorage = () => {
  const user = window.localStorage.getItem('sns_user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.token;
  }
  return null;
};

const getFollowing = createAsyncThunk(
  'user/following',
  async (arg, { rejectWithValue }) => {
    const token = getTokenFromLocalStorage();
    try {
      const { status, data } = await axios.get(`/apihost/api/v1/me/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (status === 200) {
        console.log(data);
        return data;
      } else {
        return rejectWithValue('Unexpected response status: ' + status);
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.errors[0] || 'Unknown error',
      );
    }
  },
);

const getWaiting = async () => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/me/waiting-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    throw error;
  }
};

const getWaitingFriend = async () => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/me/waiting-friend`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    throw error;
  }
};

const getFriendsByFriendsId = async ({ id }) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.get(`/apihost/api/v1/me/user/${id}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    throw error;
  }
};

const unFriend = async ({ id }) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.delete(`/apihost/api/v1/me/friends/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    throw error;
  }
};
const addFriend = async ({ id }) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.post(
      `/apihost/api/v1/me/friends/${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error during user fetch:', error);
    throw error;
  }
};

const acceptFriends = async ({ id }) => {
  const token = getTokenFromLocalStorage();
  try {
    const response = await axios.put(`/apihost/api/v1/me/friends/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error('Error during user fetch:', err);
    throw err;
  }
};

export const mutualFriends = createAsyncThunk(
  'friend/fetchMutualFriends',
  async ({ id }, { rejectWithValue }) => {
    const token = getTokenFromLocalStorage();

    try {
      const response = await axios.get(`/apihost/api/v1/me/mutual/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue({ id, mutualFriends: 0 });
    }
  },
);

export default {
  getFollowing,
  getWaiting,
  getFriendsByFriendsId,
  unFriend,
  addFriend,
  acceptFriends,
  getWaitingFriend,
  mutualFriends,
};
