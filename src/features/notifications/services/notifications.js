import axios from '../../../utils/axiosClient';

// Lấy danh sách thông báo
export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`/apihost/api/v1/notifications`, {
      params: { userId }, // Truyền tham số userId
    });
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
      params: { userId }, // Truyền tham số userId
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};


// Thích bài viết
export const likePost = async ({ senderId, recipientId, postId }) => {
  try {
    await axios.post('/api/v1/notifications/like-post', null, {
      params: { senderId, recipientId, postId },
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Thích bình luận
export const likeComment = async ({ senderId, recipientId, commentId }) => {
  try {
    await axios.post('/api/v1/notifications/like-comment', null, {
      params: { senderId, recipientId, commentId },
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Bình luận bài viết
export const commentPost = async ({ senderId, recipientId, postId }) => {
  try {
    await axios.post('/api/v1/notifications/comment-post', null, {
      params: { senderId, recipientId, postId },
    });
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Trả lời bình luận
export const replyComment = async ({ senderId, recipientId, commentId }) => {
  try {
    await axios.post('/api/v1/notifications/reply-comment', null, {
      params: { senderId, recipientId, commentId },
    });
  } catch (error) {
    console.error('Error replying to comment:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};

// Đếm thông báo chưa đọc
export const countUnreadNotifications = async (userId) => {
  try {
    const response = await axios.get(`/apihost/api/v1/notifications/count`, {
      params: { userId }, // Truyền tham số userId
    });
    return response.data; // Trả về số lượng thông báo chưa đọc
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};