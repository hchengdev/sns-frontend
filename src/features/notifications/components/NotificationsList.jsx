import React, { useEffect, useState } from 'react';
import { fetchNotifications } from '../services/notifications.js'; // Nhập service
import { List, Spin, Alert } from 'antd'; // Nhập các component cần thiết từ antd

const NotificationsList = ({ userId }) => { // Thêm userId như prop
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await fetchNotifications(userId); // Gọi service để lấy thông báo
        setNotifications(data); // Cập nhật danh sách thông báo
      } catch (err) {
        setError(err); // Cập nhật lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    loadNotifications();
  }, [userId]); // Chạy lại effect khi userId thay đổi

  if (loading) return <Spin tip="Loading notifications..." />; // Hiển thị loading
  if (error) return <Alert message="Error fetching notifications" description={error.message} type="error" />; // Hiển thị lỗi

  return (
    <div className="notifications-list">
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <List
          bordered
          dataSource={notifications}
          renderItem={notification => (
            <List.Item key={notification.id}>
              {notification.message} {/* Giả sử thông báo có thuộc tính message */}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationsList;
