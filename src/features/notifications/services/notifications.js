import axios from '../../../utils/axiosClient';

// Lấy danh sách thông báo
export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`/apihost/api/v1/notifications/${userId}`); // Sử dụng đường dẫn đúng
    return response.data; // Trả về dữ liệu
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = async (userId) => {
  try {
    await axios.get(`/apihost/api/v1/notifications/mark-all-read`, {
      params: { userId } // Truyền tham số userId
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};