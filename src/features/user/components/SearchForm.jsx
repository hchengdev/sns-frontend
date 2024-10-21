import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserByName } from '../services/user';
import { mutualFriends } from '../../../features/friend/services/friend';
import { getUserFromLocalStorage } from '../../../utils/axiosClient';
import { clearListUser } from '../store/userSlice';

const SearchForm = () => {
  const dispatch = useDispatch();
  const { listUser, mutualFriendsList, isLoading } = useSelector(
    (state) => state.user,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const storedUser = getUserFromLocalStorage();
  const meId = storedUser.id;

  const searchRef = useRef(null);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      dispatch(clearListUser());
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      dispatch(clearListUser());
      return;
    }

    try {
      await dispatch(getUserByName({ name: searchQuery }));
      setIsSearching(true);
      listUser.forEach((user) => {
        dispatch(mutualFriends({ id: user.id }));
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
    }
  };

  return (
    <div className="top-search relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit} method="post" className="flex">
        <input
          type="text"
          placeholder="Search People, Pages, Groups etc"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-[80%] border-collapse rounded-l-[30px] border-gray-400 bg-[#49586e] p-[9px_18px] text-[15px] text-white placeholder-gray-400 focus:border-transparent focus:outline-none"
        />
        <button
          type="submit"
          className="border-collapse rounded-r-[30px] bg-[#49586e] pl-3 pr-3 text-white hover:bg-slate-500"
        >
          <FontAwesomeIcon icon={faSearch} className="mr-2" />
        </button>
      </form>

      {isSearching && listUser.length > 0 && (
        <div>
          <ul className="absolute mt-2 w-[80%] rounded border bg-white shadow-lg">
            {listUser.slice(0, 5).map((user) => (
              <li key={user.id} className="p-2 hover:bg-gray-200">
                {user.id === meId ? (
                  <Link to={`/me`}>
                    <div className="ml-5 flex items-center">
                      <img
                        src={`/apihost/image/${user.profilePicture}`}
                        alt={user.name}
                        className="mr-2 h-[40px] w-[40px] rounded-full"
                      />
                      <span className="ml-3">{user.name}</span>
                      {mutualFriendsList[user.id] !== undefined && (
                        <span className="ml-2 text-gray-500">
                          ({mutualFriendsList[user.id]} bạn chung)
                        </span>
                      )}
                    </div>
                  </Link>
                ) : (
                  <Link to={`/users/${user.id}`}>
                    <div className="ml-5 flex items-center">
                      <img
                        src={`/apihost/image/${user.profilePicture}`}
                        alt={user.name}
                        className="mr-2 h-[40px] w-[40px] rounded-full"
                      />
                      <span className="ml-3">{user.name}</span>
                      {mutualFriendsList[user.id] !== undefined && (
                        <span className="ml-2 text-gray-500">
                          ({mutualFriendsList[user.id]} bạn chung)
                        </span>
                      )}
                    </div>
                  </Link>
                )}
              </li>
            ))}
            {listUser.length > 0 && (
              <div className="mt-2">
                <Link
                  to="/search-users"
                  className="text-blue-500 hover:underline"
                >
                  Xem tất cả người dùng
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}

      {isSearching && listUser.length === 0 && (
        <div className="absolute z-10 mt-2 w-[80%] rounded border bg-white p-2 text-gray-500 shadow-lg">
          Không tìm thấy người dùng nào.
        </div>
      )}
    </div>
  );
};

export default SearchForm;
