import { useEffect, useState } from 'react';
import { fetchNotifications } from '../services/notifications.js';
import { List, Spin, Alert } from 'antd';

const NotificationsList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [userId]);

  if (loading) return <Spin tip="Loading notifications..." />;
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
              {notification.message}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationsList;
