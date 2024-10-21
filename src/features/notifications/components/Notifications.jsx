import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAllAsRead } from '../store/notificationsSlice.js';
import { selectNotifications, selectLoading, selectError } from '../store/notificationsSlice.js';
import NotificationsList from './NotificationsList';

const Notifications = ({ userId }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(getNotifications(userId)); // Gọi hàm để lấy thông báo
  }, [dispatch, userId]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead(userId)); // Gọi hàm để đánh dấu tất cả thông báo là đã đọc
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Thông Báo của Bạn</h1>
      <button onClick={handleMarkAllAsRead}>Đánh dấu tất cả là đã đọc</button>
      <NotificationsList notifications={notifications} />
    </div>
  );
};

export default Notifications;