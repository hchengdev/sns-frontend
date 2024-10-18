import { HiDotsHorizontal } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, updatePost, toggleLikePost } from '../services/post';
import { toast } from 'react-toastify';
import { FaComments } from 'react-icons/fa';
import CommentList from '../../comment/components/CommentList'; // Import CommentList
import { FaEarthAmericas, FaLock, FaUserGroup } from 'react-icons/fa6';
import { Carousel } from 'antd';

const Post = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [visibility, setVisibility] = useState(post.visibility);
  const [media, setMedia] = useState([]);
  const [isLiked, setIsLiked] = useState(
    post.likes.likeByUsers.includes(post.userId),
  );
  const [likeCount, setLikeCount] = useState(post.likes.likeCount);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLiked(post.likes.likeByUsers.includes(user.id));
    setLikeCount(post.likes.likeCount);
  }, [post, user.id]);

  const handleLike = async () => {
    try {
      const previousLikedState = isLiked;
      await dispatch(toggleLikePost(post.id)).unwrap();
      setIsLiked(!previousLikedState);
      setLikeCount(previousLikedState ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Thao tác thích không thành công:', error);
      toast.error('Có lỗi xảy ra khi thực hiện thao tác thích.');
    }
  };

  const toggleOptions = () => setShowOptions((prev) => !prev);

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
        updatePost({ postId: post.id, content, visibility, media }),
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
      PUBLIC: <FaEarthAmericas className="text-gray-500" />,
    };
    return (
      visibilityIcons[visibility] || (
        <span className="text-gray-500">Không xác định</span>
      )
    );
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  };

  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
    setNewComment('');
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

  const renderLike = (post) => {
    const postLiked = post.likes.likeByUsers.filter(
      (item) => item.id === user.id,
    );
    if (postLiked && postLiked.length > 0) {
      return (
        <span className="cursor-pointer text-lg" onClick={handleLike}>
          ❤️ {likeCount} Thích
        </span>
      );
    } else {
      return (
        <span className="cursor-pointer text-lg" onClick={handleLike}>
          🤍 {likeCount} Thích
        </span>
      );
    }
  };

  return (
    <div className="pb-5">
      <div className="ml-0 flex border py-3 pl-2 pr-1 hover:bg-slate-100 sm:mx-3 sm:mr-0 sm:px-5 sm:pr-0">
        <div className="mt-3 h-12 w-12 flex-none text-lg">
          <img
            src="/logo_img.png"
            className="h-12 w-12 flex-none cursor-pointer rounded-full object-cover"
            alt="avatar"
          />
        </div>

        <div className="w-full px-4 py-3">
          <div className="relative flex w-full justify-between">
            <h2 className="flex cursor-pointer items-center font-semibold">
              <span className="pl-1.5 font-normal text-slate-500">
                User {post.userId}
              </span>
              <span className="ml-2 flex items-center text-sm text-gray-500">
                {getVisibilityText(post.visibility)}
              </span>
            </h2>

            <HiDotsHorizontal
              className="mr-3 cursor-pointer"
              onClick={toggleOptions}
            />
            {/* Action button */}
            {showOptions && (
              <div className="absolute right-0 top-6 rounded border bg-white shadow-md">
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 hover:bg-red-500 hover:text-white"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 hover:bg-yellow-500 hover:text-white"
                >
                  Chỉnh sửa
                </button>
              </div>
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
              <div className="mt-2 flex">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="ml-0.5 mr-2 rounded bg-slate-200 px-2 py-1 text-slate-600"
                >
                  <option value="PRIVATE">Riêng tư</option>
                  <option value="FRIENDS_ONLY">Bạn bè</option>
                  <option value="PUBLIC">Công khai</option>
                </select>
                <input type="file" onChange={handleMediaChange} multiple />
              </div>
              <button
                className="mt-3 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                onClick={handleEditPost}
              >
                Cập nhật bài viết
              </button>
            </div>
          ) : (
            <div>
              <div className="mt-3 bg-red-500 text-lg">{content}</div>
              {post.media && post.media.length > 0 && renderMedia()}

              {/* Combined Like and Comment Section */}
              <form className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  {renderLike(post)}
                  <span
                    className="ml-4 cursor-pointer text-lg"
                    onClick={() => setShowComments((prev) => !prev)}
                  >
                    <FaComments className="inline-block" /> Bình luận (
                    {comments.length})
                  </span>
                </div>
              </form>

              {/* Render Comment List when clicked */}
              {showComments && (
                <div className="mt-4">
                  <CommentList comments={comments} />
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Nhập bình luận..."
                    className="mt-2 w-full rounded border px-2 py-1"
                  />
                  <button
                    onClick={() => handleAddComment(newComment)}
                    className="mt-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                  >
                    Gửi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
