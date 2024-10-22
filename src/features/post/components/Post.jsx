import { HiDotsHorizontal } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, updatePost, toggleLikePost } from '../services/post';
import { toast } from 'react-toastify';
import CommentList from '../../comment/components/CommentList';
import { FaEarthAmericas, FaLock, FaUserGroup } from 'react-icons/fa6';
import { Carousel, Tooltip } from 'antd';
import CommentForm from '../../comment/components/CommentForm.jsx';
import { CommentOutlined, LikeOutlined } from '@ant-design/icons';

const Post = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [visibility, setVisibility] = useState(post.visibility);
  const [media, setMedia] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user ? user.id : null;
  const [likeState, setLikeState] = useState({
    isLiked: post.likes?.likeByUsers?.includes(userId) || false,
    likeCount: post.likes?.likeCount || 0,
    likedByUsers: post.likes?.likeByUsers || []
  });
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setContent(post.content);
    setVisibility(post.visibility);
    setLikeState({
      isLiked: post.likes?.likeByUsers?.includes(userId) || false,
      likeCount: post.likes?.likeCount || 0,
      likedByUsers: post.likes?.likeByUsers || []
    });
  }, [post, userId]);

  const handleLike = async () => {
    const { isLiked } = likeState; // sửa lỗi: dùng biến isLiked thay vì isLike
    try {
      const response = await dispatch(toggleLikePost(post.id)).unwrap();
      if (response && response.likeCount !== undefined) {
        setLikeState(prev => ({
          ...prev,
          isLiked: !isLiked,
          likeCount: response.likeCount,
          likedByUsers: response.likedByUsers || []
        }));
        const likedPost = JSON.parse(localStorage.getItem('likedPosts')) || {};
        likedPost[post.id] = !isLiked;
        localStorage.setItem('likedPosts', JSON.stringify(likedPost)); // sửa tên key là likedPosts
      } else {
        throw new Error('LikeCount không có trong phản hồi');
      }
    } catch (error) {
      console.error('Thao tác thích không thành công:', error);
      toast.error('Có lỗi xảy ra khi thực hiện thao tác thích.');
    }
  };

  const userProfileImg = post.createdBy?.profilePicture
    ? `/apihost/image/${post.createdBy.profilePicture}`
    : '/path/to/default/image.png';

  const toggleOptions = () => setShowOptions((prev) => !prev);


  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDeletePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        toast.success('Bài đăng đã được xóa thành công!');
      } catch (error) {
        console.error('Xóa bài đăng không thành công:', error);
        toast.error('Có lỗi xảy ra khi xóa bài đăng.');
      }
    }
  };

  const handleEditPost = async () => {
    if (!content.trim()) {
      toast.error('Nội dung không được để trống!');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('visibility', visibility);
    media.forEach((file) => formData.append('file', file));

    try {
      await dispatch(
        updatePost({ postId: post.id, content, visibility, media })
      ).unwrap();
      toast.success('Bài đăng đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Cập nhật bài đăng không thành công:', error);
      toast.error('Có lỗi xảy ra khi cập nhật bài đăng.');
    }
  };

  const getVisibilityText = (visibility) => {
    const visibilityIcons = {
      PRIVATE: <FaLock className="text-gray-500" />,
      FRIENDS_ONLY: <FaUserGroup className="text-gray-500" />,
      PUBLIC: <FaEarthAmericas className="text-gray-500" />
    };
    return (
      visibilityIcons[visibility] || (
        <span className="text-gray-500">Không xác định</span>
      )
    );
  };

  // Kiểm tra quyền truy cập
  if (post.visibility === 'PRIVATE' && post.userId !== userId) {
    return null;
  }

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  };

  const handleCommentSubmit = (postId, newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const renderMedia = () => (
    <Carousel arrows infinite={false}>
      {post.media.map((mediaItem, index) => (
        <div key={mediaItem.id}>
          <img
            src={`/apihost${mediaItem.url}`}
            className="mx-auto my-2 max-h-80 max-w-full rounded-md"
            alt={`post media ${index + 1}`}
          />
        </div>
      ))}
    </Carousel>
  );

  const renderLike = () => {
    const tooltipContent = likeState.likedByUsers.length > 0
      ? likeState.likedByUsers.map(user => user.name).join(', ')
      : 'Chưa có ai thích';
    return (
      <Tooltip title={tooltipContent} placement="top">
        <span className="cursor-pointer text-lg" onClick={handleLike}>
          <LikeOutlined />
          <span className="ml-1">({likeState.likeCount})</span>
        </span>
      </Tooltip>
    );
  };

  const parseDateString = (dateString) => {
    const [time, date] = dateString.split(' ');
    const [day, month, year] = date.split('/').map(Number);
    return new Date(year, month - 1, day, ...time.split(':').map(Number));
  };

  return (
    <div className="pb-5">
      <div className="border rounded-xl overflow-hidden border-l border-solid border-zinc-300 bg-white shadow-md rounded-lg">
        <div className="ml-0 flex py-3 pl-2 pr-1 sm:mr-0 sm:px-5 sm:pr-0">
          <div className="mt-3 h-12 w-12 flex-none text-lg">
            <img
              src={userProfileImg}
              className="h-12 w-12 flex-none cursor-pointer rounded-full object-cover"
              alt="avatar"
            />
          </div>

          <div className="w-full px-4 py-3">
            <div className="relative flex w-full justify-between">
              <h2 className="cursor-pointer font-semibold flex items-center">
                <span className="pl-1.5 font-normal text-slate-500">
                  {post.createdBy.name}
                </span>

                <span className="ml-2 text-sm text-gray-500 flex items-center">
                  {getVisibilityText(post.visibility)}
                </span>
              </h2>
              <span className="text-xs text-gray-400 ml-2">
              {parseDateString(post.createdAt).toLocaleString()} {/* Hiển thị thời gian */}
            </span>
              {/*<p className="text-sm text-gray-600">{formatDate(post.createdAt) || 'Unknown Date'}</p>*/}

              {post.userId === userId && (
                <>
                  <HiDotsHorizontal className="mr-3 cursor-pointer" onClick={toggleOptions} />
                  {showOptions && (
                    <div
                      className="absolute right-7 top-0 z-20 rounded-xl border border-slate-300 bg-white font-semibold text-slate-600 shadow-xl">
                      <ul className="cursor-pointer text-start">
                        <li
                          className="rounded-xl px-5 py-2 hover:bg-slate-200"
                          onClick={() => {
                            setIsEditing(true);
                            setShowOptions(false);
                          }}
                        >
                          Cập nhật
                        </li>
                        <li
                          className="rounded-xl px-5 py-2 hover:bg-slate-200"
                          onClick={handleDeletePost}
                        >
                          Xoá
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {isEditing ? (
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-3 w-full resize-none rounded-xl bg-slate-100 p-2 pb-3 focus:outline-none"
                  placeholder="Nội dung bài đăng..."
                  rows={4}
                />
                <div className="flex mt-2">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="ml-0.5 mr-2 rounded bg-slate-200 px-2 py-1 text-gray-700"
                  >
                    <option value="PUBLIC">Công khai</option>
                    <option value="FRIENDS_ONLY">Bạn bè</option>
                    <option value="PRIVATE">Riêng tư</option>
                  </select>
                </div>
                <div className="flex mt-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleMediaChange}
                    className="ml-2 cursor-pointer"
                  />
              </div>
                  <button
                    onClick={handleEditPost}
                    className="ml-3 rounded-xl bg-blue-500 px-3 py-1 text-white"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="ml-3 rounded-xl bg-red-500 px-3 py-1 text-white"
                  >
                    Hủy
                  </button>
                </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap">{post.content}</p>
            )}

            {post.media && post.media.length > 0 && renderMedia()}

            {/*<div className="ml-0 flex  py-3 pl-2 pr-1 sm:mr-0 sm:px-5 sm:pr-0">*/}
            {/*  <p className="text-sm text-gray-600">{post.createdAt || 'Unknown Date'}</p>*/}
            {/*</div>*/}

            <div className="px-5 pb-5">
              <div>
                {/* Combined Like and Comment Section */}
                <form className="flex items-center justify-between mt-3">
                  <div className="flex items-center">
                    {renderLike(post)}
                    <CommentOutlined className="ml-4 cursor-pointer" onClick={() => toggleComments(post.id)} />
                    <span className="ml-2">{comments.length} bình luận</span> {/* Hiển thị tổng số bình luận */}
                  </div>
                </form>
              </div>
              {/* Render Comment List when clicked */}
              {showComments[post.id] && (
                <div className="mt-4">
                  <CommentList comments={comments} />
                  <CommentForm
                    postId={post.id}
                    userId={userId}
                    onCommentAdded={handleCommentSubmit}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
