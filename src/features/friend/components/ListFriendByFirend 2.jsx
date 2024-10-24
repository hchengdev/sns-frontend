import friendService from '../../friend/services/friend';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getUserFromLocalStorage } from '../../../utils/axiosClient';

const ListFriendByFriend = () => {
  const dispatch = useDispatch();
  const { getFriendsByFriendsId, mutualFriends } = friendService;
  const [suggestionList, setSuggestionList] = useState([]);
  const [mutualFriendsList, setMutualFriendsList] = useState([]);
  const { id } = useParams();
  const storedUser = getUserFromLocalStorage();
  const meId = storedUser.id;
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await getFriendsByFriendsId({ id });
        setSuggestionList(response);
      } catch {
        setSuggestionList([]);
      }
    };

    fetchFollowing();
  }, [dispatch, getFriendsByFriendsId]);

  useEffect(() => {
    const fetchMutual = async (id) => {
      try {
        const response = await mutualFriends({ id });
        setMutualFriendsList(response);
      } catch {
        setMutualFriendsList([]);
      }
    };

    fetchMutual();
  }, []);
  return (
    <div>
      <div className="mb-4 mt-6 flex items-center">
        <h1 className="mr-2 text-center text-xl font-bold">Danh sách bạn bè</h1>
        {mutualFriendsList.length > 0 && (
          <div className="mt-[1px]">({mutualFriendsList.length} bạn chung)</div>
        )}
      </div>
      {suggestionList.length > 0 ? (
        <div className="flex-1">
          <ul>
            {suggestionList.slice(0, 5).map((user) =>
              meId == user.id ? (
                <li key={user.id} className="mb-3 flex items-center">
                  <Link to={`/me`} className="flex items-center">
                    <img
                      src={
                        user.profilePicture
                          ? `/apihost/image/${user.profilePicture}`
                          : ''
                      }
                      className="ml-[2rem] h-14 w-14 rounded-full object-cover"
                      alt="Ảnh đại diện đã tải lên"
                    />
                    <span className="ml-3 font-semibold">{user.name}</span>
                  </Link>
                </li>
              ) : (
                <li key={user.id} className="mb-3 flex items-center">
                  <Link to={`/users/${user.id}`} className="flex items-center">
                    <img
                      src={
                        user.profilePicture
                          ? `/apihost/image/${user.profilePicture}`
                          : ''
                      }
                      className="ml-[2rem] h-14 w-14 rounded-full object-cover"
                      alt="Ảnh đại diện đã tải lên"
                    />
                    <span className="ml-3 font-semibold">{user.name}</span>
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Link
            to={'/list-friend'}
            className="ml-52 mt-4 rounded p-2 text-blue-600"
          >
            Show all
          </Link>
        </div>
      ) : (
        <p>Không có bạn bè</p>
      )}
    </div>
  );
};

export default ListFriendByFriend;
