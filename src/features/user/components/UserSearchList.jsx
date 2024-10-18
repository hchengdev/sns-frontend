import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../../../src/components/NavBar';
import { Link } from 'react-router-dom';
import { getUserFromLocalStorage } from '../../../utils/axiosClient';

const UserList = () => {
  const { listUser } = useSelector((state) => state.user);
  const storedUser = getUserFromLocalStorage();
  const meId = storedUser.id;

  return (
    <div className="space-between mb-12 flex justify-center pt-[100px]">
      <div className="w-[15%]">
        <NavBar />
      </div>
      <div className="mx-5 flex h-[100vh] w-[50%] flex-col overflow-hidden border-solid border-l-zinc-400 bg-[#fff] px-[20px] py-[5px]">
        <header className="m-4 hidden w-full justify-between sm:flex">
          <h1 className="text-xl">List User Search</h1>
        </header>
        <ul className="hide-scrollbar space-y-6 overflow-y-auto pb-[50px]">
          {listUser.map((user) => (
            <li key={user.id}>
              {user.id == meId ? (
                <Link to={'/me'}>
                  <div className="relative flex h-auto w-full transform items-center rounded-lg border border-gray-300 bg-gray-50 p-4 transition-transform hover:scale-100 hover:cursor-pointer hover:shadow-xl">
                    <img
                      src={`/apihost/image/${user.profilePicture}`}
                      className="h-28 w-28 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
                      alt="Profile"
                    />
                    <div className="ml-6 flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link to={`users/${user.id}`}>
                  <div className="relative flex h-auto w-full transform items-center rounded-lg border border-gray-300 bg-gray-50 p-4 transition-transform hover:scale-100 hover:cursor-pointer hover:shadow-xl">
                    <img
                      src={`/apihost/image/${user.profilePicture}`}
                      className="h-28 w-28 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
                      alt="Profile"
                    />
                    <div className="ml-6 flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[20%]"></div>
    </div>
  );
};

export default UserList;
