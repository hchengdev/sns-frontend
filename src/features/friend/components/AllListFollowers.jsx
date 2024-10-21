import { useEffect, useState } from 'react';
import friendService from '../../friend/services/friend';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AllListFollowers = () => {
  const dispatch = useDispatch();
  const { getWaiting, rejectFriendRequest, acceptFriendRequest } =
    friendService;
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchWaitingRequests = async () => {
      try {
        const response = await dispatch(getWaiting());
        if (response && response.payload) {
          setFriendRequests(response.payload);
        } else {
          console.error('Dữ liệu không hợp lệ:', response);
          setFriendRequests([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu yêu cầu kết bạn:', err);
        setFriendRequests([]);
      }
    };

    fetchWaitingRequests();
  }, [dispatch, getWaiting]);

  const handleProfileClick = (id) => {
    alert('ID của người dùng:' + id);
  };

  const handleReject = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu kết bạn này?')) {
      try {
        await dispatch(rejectFriendRequest(userId));
        setFriendRequests(friendRequests.filter((user) => user.id !== userId));
        toast.success('Đã từ chối yêu cầu kết bạn thành công!');
      } catch (err) {
        console.error('Lỗi khi hủy yêu cầu kết bạn:', err);
        toast.error('Có lỗi xảy ra, vui lòng thử lại.');
      }
    }
  };

  const handleAcceptFriendRequest = async (id) => {
    if (
      window.confirm('Bạn có chắc chắn muốn xác nhận kết bạn với người này?')
    ) {
      try {
        await dispatch(acceptFriendRequest(id));
        setFriendRequests((prevRequests) =>
          prevRequests.filter((friend) => friend.id !== id),
        );
        toast.success('Đã xác nhận yêu cầu kết bạn thành công!');
      } catch (err) {
        console.error('Lỗi khi xác nhận yêu cầu:', err);
        toast.error('Có lỗi xảy ra, vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 pt-[100px]">
      <div className="mx-5 flex h-auto flex-col overflow-hidden rounded-lg bg-white p-6 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Người muốn kết bạn
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {friendRequests.map((friend) => (
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
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="rounded-lg bg-blue-500 px-4 py-1 text-sm text-white transition duration-200 hover:bg-blue-600"
                      onClick={() => handleAcceptFriendRequest(friend.id)}
                    >
                      Add friend
                    </button>
                    <button
                      className="w-20 rounded-lg bg-gray-300 p-2 text-xs text-black hover:bg-gray-400"
                      onClick={() => handleReject(friend.id)}
                    >
                      Cancle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllListFollowers;