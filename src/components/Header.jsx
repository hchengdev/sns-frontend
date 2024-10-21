import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/store/authSlice';
import userService from '../../src/features/user/services/user';
import { useEffect, useState } from 'react';
import { getUserFromLocalStorage } from '../utils/axiosClient';
import SearchForm from '../features/user/components/SearchForm';
import { faUser, faPencilAlt, faPowerOff, faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Notifications from '../features/notifications/components/Notifications.jsx';
import { MessageOutlined } from '@ant-design/icons'; // Import MessageOutlined từ Ant Design

const DropdownList = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="user-setting absolute right-14 top-[65px] z-10 hidden w-48 items-center rounded-lg bg-white text-center shadow-lg group-hover:block">
      <ul className="log-out">
        <li className="w-[100%] rounded-lg py-1 hover:bg-gray-200">
          <Link to="/me" className="flex h-8 items-center pl-5 text-gray-600">
            <FontAwesomeIcon icon={faUser} className="mr-2" /> View Profile
          </Link>
        </li>
        <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
          <Link to="/update-profile" className="flex h-8 items-center text-gray-600">
            <FontAwesomeIcon icon={faPencilAlt} className="mr-2" /> Edit Profile
          </Link>
        </li>
        <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
          <Link to="/update-password" className="flex h-8 items-center text-gray-600">
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            Update Password
          </Link>
        </li>
        <li className="rounded-lg py-1 pl-5 hover:bg-gray-200">
          <Link to="/login" className="flex h-8 items-center text-gray-600" onClick={handleLogout}>
            <FontAwesomeIcon icon={faPowerOff} className="mr-2" /> Log out
          </Link>
        </li>
      </ul>
    </div>
  );
};

const UserInformation = ({ user }) => {
  return (
    <div className="group flex h-16 cursor-pointer items-center justify-center leading-[65px]">
      <h5 className="mr-2 inline-block text-[14px] font-medium text-white">{user.name}</h5>
      <img
        src={user.profilePicture ? `/apihost/image/${user.profilePicture}` : null}
        className="h-[50px] w-[50px] rounded-full border-2 border-white border-opacity-80 object-cover"
        alt="profile"
        style={{ transform: 'scale(0.8)' }}
      />
      <span className="status f-online absolute bottom-2 right-1"></span>
      <DropdownList />
    </div>
  );
};

const LoginButton = () => {
  return (
    <div className="col-span-1 col-end-6">
      <Link
        className="hover:border-info-600 hover:text-info-600 focus:border-info-600 focus:text-info-600 active:border-info-700 active:text-info-700 rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-center text-xs font-bold uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-0 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        to={'/login'}
      >
        Login
      </Link>
    </div>
  );
};

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="fixed left-0 top-0 w-full">
      <div className="fixed flex h-[66px] w-full items-center bg-[#34465d] px-4 shadow-[0px_0px_5px_rgba(0,0,0,0.2)] sm:grid sm:grid-cols-12">
        <div className="ml-0 max-h-[66px] sm:col-span-2 sm:col-start-2">
          <Link title="homepage" to="/">
            <img className="max-h-[66px]" src="/logo_img.png" alt="logo" />
          </Link>
        </div>
        <div className="col-span-8 grid h-full w-full grid-cols-4 items-center">
          <SearchForm />

          {/* Thêm icon tin nhắn */}
          <div className="flex justify-center items-center cursor-pointer">
            <Link to="/messager" className="text-white">
              <MessageOutlined style={{ fontSize: '24px' }} />
            </Link>
          </div>

          {user ? <UserInformation user={user} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;
