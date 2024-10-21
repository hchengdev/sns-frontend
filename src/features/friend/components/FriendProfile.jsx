import { useEffect, useState } from 'react';
import NavBar from '../../../components/NavBar';
import UserPost from '../../post/components/UserPost';
import userService from '../../user/services/user';
import { Link, useParams } from 'react-router-dom';
import ListFriendByFriend from './ListFriendByFirend';
import friendService from '../services/friend';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const FriendProfile = () => {
  const { id } = useParams();
  const { getUsersById } = userService;

  const {
    getFollowing,
    getFriendsByFriendsId,
    unFriend,
    addFriend,
    getWaiting,
    acceptFriends,
    getWaitingFriend,
  } = friendService;

  const [user, setUser] = useState({
    name: '',
    email: '',
    profile_picture: '',
    biography: '',
  });
  const [suggestionList, setSuggestionList] = useState([]);
  const [listFriendUser, setListFriendUser] = useState([]);
  const [listWaiting, setListWaiting] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [listUpdated, setListUpdated] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchFriendUser = async () => {
      try {
        const response = await dispatch(getFollowing());
        setListFriendUser(response?.payload || []);
      } catch {
        setListFriendUser([]);
      }
    };

    fetchFriendUser();
  }, [dispatch, getFollowing, listWaiting]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getWaiting();
        setFollowers(response);
      } catch {
        setFollowers([]);
      }
    };

    fetchFollowers();
  }, [dispatch, getWaiting, listUpdated]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getWaitingFriend();
        setListWaiting(response);
      } catch {
        setListWaiting([]);
      }
    };

    fetchFollowers();
  }, [dispatch, getWaiting, listUpdated]);

  // FriendProfile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { name, email, profile_picture, biography } = await getUsersById({
          id,
        });

        setUser({
          profile_picture,
          name,
          biography,
          email,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchData();
  }, []);

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
  }, [listUpdated, listFriendUser]);

  // handle
  const handleUnFriend = async () => {
    try {
      await unFriend({ id });
      setListFriendUser((prevList) =>
        prevList.filter((friend) => friend.id !== Number(id)),
      );
      setListUpdated([]);
    } catch (err) {
      console.error('Error unfriending user:', err);
    }
  };

  const handleAddFriend = async () => {
    try {
      await addFriend({ id });
      setListUpdated((prevState) => !prevState);
    } catch (err) {
      console.error('Error unfriending user:', err);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await acceptFriends({ id: userId });

      setListWaiting((prevList) =>
        prevList.filter((user) => user.id !== userId),
      );

      setListUpdated((prevState) => !prevState);
      toast.success('Đã xác nhận yêu cầu kết bạn thành công!');
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="space-between mb-12 flex justify-center pt-[100px]">
      <div className="w-[15%]">
        <NavBar />
      </div>
      <div className="mx-5 flex h-[100vh] w-[50%] flex-col overflow-hidden border-solid border-l-zinc-400 bg-[#fff] px-[20px] py-[5px]">
        <header className="m-4 hidden w-full justify-between sm:flex">
          <h1 className="text-xl">Profile</h1>
        </header>
        <div className="hide-scrollbar mx-auto flex flex-1 flex-col items-center overflow-y-auto">
          <div className="flex items-center">
            <img
              src={
                user.profilePicture
                  ? `/apihost/image/${user.profilePicture}`
                  : ''
              }
              className="h-32 w-32 rounded-full object-cover"
              alt="profile_picture"
            />
            <div className="ml-8">
              <h2 className="mb-1 ml-1 font-semibold">{user.name}</h2>
              <h2 className="mb-3">{user.email}</h2>
              {listFriendUser.find((friend) => friend.id === Number(id)) ? (
                <button
                  onClick={() => handleUnFriend()}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="mr-2 w-28 rounded-lg bg-blue-600 py-[0.55rem] text-xs text-white hover:bg-blue-700"
                >
                  {isHovered ? 'Huỷ kết bạn' : 'Bạn bè'}
                </button>
              ) : listWaiting.find((friend) => friend.id === Number(id)) ? (
                <div>
                  <button
                    onClick={() => handleAccept(id)}
                    className="mr-2 w-28 rounded-lg bg-blue-600 py-[0.55rem] text-xs text-white"
                  >
                    Chấp nhận lời mời
                  </button>

                  <button
                    onClick={() => handleUnFriend()}
                    className="mr-2 w-28 rounded-lg bg-gray-400 py-[0.55rem] text-xs text-white"
                  >
                    Từ chối
                  </button>
                </div>
              ) : followers.find((friend) => friend.id === Number(id)) ? (
                <button
                  onClick={() => handleUnFriend()}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="mr-2 w-28 rounded-lg bg-gray-400 py-[0.55rem] text-xs text-white"
                >
                  {isHovered ? 'Hủy lời mời' : 'Chờ xác nhận'}
                </button>
              ) : (
                <button
                  onClick={() => handleAddFriend()}
                  className="mr-2 w-28 rounded-lg bg-blue-600 py-[0.55rem] text-xs text-white hover:bg-blue-700"
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <h2 className="font-semibold">{user.biography}</h2>
          </div>
          <div className="mx-auto mb-16 mt-4 flex justify-center gap-6 pl-4">
            <h3 className="cursor-pointer text-base sm:text-xl">
              <span className="text-base text-slate-600 sm:text-xl">
                10 post
              </span>
            </h3>
            <h3 className="cursor-pointer text-base sm:text-xl">
              <span className="pl-1 text-slate-600">
                {suggestionList.length} friends
              </span>
            </h3>
            <h3 className="cursor-pointer text-base sm:text-xl">
              <span className="pl-1 text-slate-600">
                {listWaiting.length} followers
              </span>
            </h3>
          </div>
          <UserPost />
        </div>
      </div>
      <div className="w-[20%]">
        <div className="mb-10 flex h-full flex-col">
          <ListFriendByFriend />
          <hr className="my-4" />
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;