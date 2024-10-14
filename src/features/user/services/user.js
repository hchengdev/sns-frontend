import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


const getTokenFromLocalStorage = () => {
    const user = window.localStorage.getItem('sns_user');
    if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.token;
    }
    return null;
};

const updateUser = async (id, user) => {
    const token = getTokenFromLocalStorage();
    try {
        const response = await axios.put(`/apihost/api/v1/${id}`, user, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error during user update:', error);
        throw error;
    }
};

const getUser = async (id) => {
    const token = getTokenFromLocalStorage();
    try {
        const response = await axios.get(`/apihost/api/v1/me/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error during user fetch:', error);
        throw error;
    }
};
const unFollowUser = createAsyncThunk("user/unfollow", async ({ followUserId, token }, { rejectWithValue }) => {
    try {
        const { status, data } = await axios.delete(`/api/v1/me/following/${followUserId}`,
            {},
            {
                headers: { authorization: token }
            });

        if (status === 200) {
            return data;
        }
    } catch (error) {
        return rejectWithValue(error.response.data.errors[0]);
    }
});

const followUser = createAsyncThunk("user/follow",
    async ({ followUserId, token }, { rejectWithValue }) => {
        try {
            const { status, data } = await axios.post(`/api/v1/me/following/${followUserId}`,
                {},
                {
                    headers: { authorization: token }
                });

            if (status === 200) {
                return data;
            }
        } catch (error) {
            return rejectWithValue(error.response.data.errors[0]);
        }
    });

const getFollowing = createAsyncThunk("user/following",
    async ({ userId, token }, { rejectWithValue }) => {
        try {
            const { status, data } = await axios.get(`/api/v1/me/${userId}/following`,

                {
                    headers: { authorization: token }
                });

            if (status === 200) {
                return data;
            }
        } catch (error) {
            return rejectWithValue(error.response.data.errors[0]);
        }
    });

    const updatePassWord = createAsyncThunk("user/update-password",
        async ({ userId, oldPassword, newPassword, token }, { rejectWithValue }) => {
            try {
                const { status, data } = await axios.put(`/api/v1/me/${userId}/password`, {
                    oldPassword,
                    newPassword
                },
                    {
                        headers: { authorization: token }
                    });

                if (status === 200) {
                    return data;
                }
            } catch (error) {
                return rejectWithValue(error.response.data.errors[0]);
            }
        });

export default { updateUser, getUser, unFollowUser, followUser, getFollowing, updatePassWord };
