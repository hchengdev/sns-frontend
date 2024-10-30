import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/store/authSlice';
import userService from '../../src/features/user/services/user';
import { getUserFromLocalStorage } from '../utils/axiosClient';
import SearchForm from '../features/user/components/SearchForm';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';

import {
  faUser,
  faPencilAlt,
  faPowerOff,
  faCog,
  faBell,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { MessageOutlined } from '@ant-design/icons';
import NotificationsList from '../features/notifications/components/NotificationsList';

const Header = () => {
  const authToken = 'b24d589b248dd859c97be2e794a4c73ff14805c1';

  const dispatch = useDispatch();
  const storedUser = getUserFromLocalStorage();
  const id = storedUser ? storedUser.id : null; // Lấy ID người dùng
  const { getUser } = userService;
  const [user, setUser] = useState({
    name: '',
    profile_picture: ''
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getUser(id);
          setUser({
            profilePicture: response.profilePicture || '',
            name: response.name || ''
          });
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleLogout = () => {
    dispatch(logout());
    CometChatUIKit.logout();
    console.log('logout successfully');
  };

  const toggleNotifications = () => {
    setShowNotifications(prevState => !prevState);
  };

  // Hàm xử lý đóng thông báo khi click ra ngoài
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    // Thêm sự kiện click cho document
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Xóa sự kiện khi component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fix relative left-0 top-0 z-50 w-full">
      <div className="fixed flex h-[66px] items-center bg-[#34465d] px-4 shadow-[0px_0px_5px_rgba(0,0,0,0.2)]">
        <div className="logo relative z-10 mr-9 w-[10%]">
          <Link title="" to="/">
            <img src="/public/logo_img.png" alt="logo" />
          </Link>
        </div>
        <div className="flex w-[150vh] items-center">
          <SearchForm />
          <div className="flex group relative justify-center items-center cursor-pointer mr-4 py-4 px-[10px]">
            <MessageOutlined style={{ fontSize: '24px', color: 'white' }} />

            <div
              className="user-setting absolute right-0 top-[55px] z-10 hidden w-[9rem] items-center rounded-lg bg-white text-center shadow-lg group-hover:block">
              <ul>
                <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
                  <Link
                    to="/cometchat"
                    className="flex h-8 items-center text-gray-600"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Chat
                  </Link>
                </li>
                <li className="w-[100%] rounded-lg py-1 hover:bg-gray-200">
                  <Link
                    to="/messager"
                    className="flex h-8 items-center pl-5 text-gray-600"
                  >
                    <FontAwesomeIcon icon={faUsers} className="mr-2" /> Group Chat
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center items-center cursor-pointer relative mr-4" ref={notificationRef}>
            <button onClick={toggleNotifications} className="text-white">
              <FontAwesomeIcon icon={faBell} style={{ fontSize: '24px' }} />
            </button>

            {/* Hiển thị danh sách thông báo ngay dưới icon chuông */}
            {showNotifications && (
              <div className="absolute top-[30px] left-0 z-50 mt-2 w-64 bg-white shadow-lg rounded-[10px]">
                <NotificationsList userId={id} /> {/* Truyền userId */}
              </div>
            )}
          </div>

          <div
            className="user-img group relative flex h-16 w-[20%] cursor-pointer items-center justify-center leading-[65px]">
            <h5 className="mr-2 inline-block text-[14px] font-medium text-white">
              {user.name}
            </h5>
            <img
              src={
                user.profilePicture
                  ? `/apihost/image/${user.profilePicture}`
                  : ''
              }
              className="h-[50px] w-[50px] rounded-full border-2 border-white border-opacity-80 object-cover"
              alt="Ảnh đại diện"
              style={{ transform: 'scale(0.8)' }}
            />
            <span className="status f-online absolute bottom-2 right-1"></span>

            <div
              className="user-setting absolute right-[1rem] top-[65px] z-10 hidden w-48 items-center rounded-lg bg-white text-center shadow-lg group-hover:block">
              <ul className="log-out">
                <li className="w-[100%] rounded-lg py-1 hover:bg-gray-200">
                  <Link
                    to="/me"
                    className="flex h-8 items-center pl-5 text-gray-600"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> View
                    Profile
                  </Link>
                </li>
                <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
                  <Link
                    to="/update-profile"
                    className="flex h-8 items-center text-gray-600"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" /> Edit
                    Profile
                  </Link>
                </li>
                <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
                  <Link
                    to="/update-password"
                    className="flex h-8 items-center text-gray-600"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Update Password
                  </Link>
                </li>
                <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
                  <Link
                    to="/login"
                    className="flex h-8 items-center text-gray-600"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faPowerOff} className="mr-2" /> Log
                    out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
