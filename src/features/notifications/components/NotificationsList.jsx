import React from 'react';
import { List, Avatar } from 'antd'; // Chỉ import List và Avatar một lần
import { useSelector } from 'react-redux';
import { selectNotifications } from '../store/notificationsSlice';

const NotificationsList = () => {
  const notifications = useSelector(selectNotifications);

  // Kiểm tra nếu notifications không phải là mảng hoặc không có thông báo
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return <div>No notifications available.</div>;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(notification) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={notification.avatar} />} // Giả sử bạn có trường avatar trong dữ liệu thông báo
            title={notification.message}
          />
        </List.Item>
      )}
    />
  );
};

export default NotificationsList;