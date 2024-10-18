import { useEffect, useState } from 'react';
import friendService from '../../friend/services/friend';
import { useDispatch } from 'react-redux';

const AllListFriend = () => {
  const dispatch = useDispatch();
  const { getFollowing } = friendService;
  const [suggestionList, setSuggestionList] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await dispatch(getFollowing());
        if (response && response.payload) {
          setSuggestionList(response.payload);
        } else {
          console.error('Dữ liệu không hợp lệ:', response);
          setSuggestionList([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu người theo dõi:', err);
        setSuggestionList([]);
      }
    };

    fetchFollowing();
  }, [dispatch, getFollowing]);

  const handleProfileClick = (id) => {
    alert('ID của người bạn:' + id);
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 pt-[100px]">
      <div className="mx-5 flex h-auto flex-col overflow-hidden rounded-lg bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          All Friend
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {suggestionList.map((friend) => (
            <div
              key={friend.id}
              className="relative flex h-80 w-64 transform flex-col rounded-lg border border-gray-300 bg-gray-50 transition-transform hover:scale-100 hover:shadow-xl"
            >
              <div className="h-1/3 overflow-hidden rounded-t-lg bg-gray-200 shadow-md">
                <img
                  src="../../../../public/login_img.jpg"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  alt="Ảnh bìa"
                />
              </div>
              <div className="relative flex h-2/3 flex-col items-center justify-center p-4">
                <img
                  src={
                    friend.profilePicture
                      ? `/apihost/image/${friend.profilePicture}`
                      : '../../../../public/logo_img.png'
                  }
                  className="absolute -top-14 h-28 w-28 rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105"
                  alt="Ảnh đại diện"
                  onClick={() => handleProfileClick(friend.id)}
                />
                <div className="mt-16 flex flex-col items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {friend.name}
                  </span>
                  <span className="text-sm text-gray-600">{friend.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllListFriend;
