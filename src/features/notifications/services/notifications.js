import axios from '../../../utils/axiosClient';

export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`/apihost/api/v1/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    await axios.get(`/apihost/api/v1/notifications/mark-all-read`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};