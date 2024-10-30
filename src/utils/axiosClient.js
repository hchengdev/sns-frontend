
import Axios from 'axios';
import { toast } from 'react-toastify';

const axios = Axios.create();

axios.interceptors.request.use(
  function (config) {
    const { token } = JSON.parse(window.localStorage.getItem('sns_user'));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } else {
      toast.warn('not logged in!', { position: 'top-center', autoClose: 3000 });
      return;
    }
  },
  (error) => {
    toast.error('something went wrong!', {
      position: 'top-center',
      autoClose: 3000,
    });
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response.data;

    if (data?.message && typeof data?.message === 'string') {
      toast.error(data.message);
    } else if (data?.status && typeof data?.status === 'string') {
      toast.error(data.status + ` - Status code: ${data.code}`);
    }

    return Promise.reject(data);
  },
);
export const getUserFromLocalStorage = () => {
  try {
    const user = window.localStorage.getItem('sns_user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

export default axios;
