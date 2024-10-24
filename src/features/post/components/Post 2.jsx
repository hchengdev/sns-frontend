import { HiDotsHorizontal } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, updatePost, toggleLikePost } from '../services/post';
import { toast } from 'react-toastify';
import { FaComments } from 'react-icons/fa';
import CommentList from '../../comment/components/CommentList'; // Import CommentList
import { FaEarthAmericas, FaLock, FaUserGroup } from 'react-icons/fa6';
import { Carousel } from 'antd';
import CommentForm from '../../comment/components/CommentForm.jsx';

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
  // const [updatePosts, setUpdatedPosts] = useState(post);
  const [showComments, setShowComments] = useState({});
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = user ? user.id : null;

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

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], 
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

  if (post.visibility === "PRIVATE" && post.userId !== user.id) {
    return null; // Trả về null nếu bài viết riêng tư và người xem không phải người tạo
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
      <div className="border rounded-xl overflow-hidden border-l border-solid border-zinc-300 bg-white shadow-md rounded-lg">
        <div className="ml-0 flex py-3 pl-2 pr-1 sm:mr-0 sm:px-5 sm:pr-0">
          <div className="mt-3 h-12 w-12 flex-none text-lg">
            <img
                src="/logo_img.png"
                className="h-12 w-12 flex-none cursor-pointer rounded-full object-cover"
                alt="avatar"
            />
          </div>

          <div className="w-full px-4 py-3">
            <div className="relative flex w-full justify-between">
              <h2 className="cursor-pointer font-semibold flex items-center">
                <span className="pl-1.5 font-normal text-slate-500">User {post.userId}</span>
                <span className="ml-2 text-sm text-gray-500 flex items-center">
              {getVisibilityText(post.visibility)}
            </span>
              </h2>

              <HiDotsHorizontal className="mr-3 cursor-pointer" onClick={toggleOptions}/>
              {showOptions && (
                  <div
                      className="absolute right-7 top-0 z-20 rounded-xl border border-slate-300 bg-white font-semibold text-slate-600 shadow-xl">
                    <ul className="cursor-pointer text-start">
                      <li
                          className="rounded-xl px-5 py-2 hover:bg-slate-200"
                          onClick={() => {
                            setIsEditing(true);
                            setShowOptions(false)
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
                        className="ml-0.5 mr-2 rounded bg-slate-200 px-2 py-1 text-slate-600"
                    >
                      <option value="PRIVATE">Riêng tư</option>
                      <option value="FRIENDS_ONLY">Bạn bè</option>
                      <option value="PUBLIC">Công khai</option>
                    </select>
                  </div>
                  <div className="flex mt-2">
                    <input type="file" onChange={handleMediaChange} multiple/>
                  </div>
                  <button
                      className="mt-3 rounded bg-blue-500 py-1 px-3 text-white hover:bg-blue-600"
                      onClick={handleEditPost}
                  >
                    Cập nhật bài viết
                  </button>
                  <button
                      className="mt-3 ml-2 rounded bg-red-500 py-1 px-3 text-white hover:bg-red-600"
                      onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </div>
            ) : (
                <p className="max-w-lg cursor-pointer break-words py-3">
                  {post.content}
                </p>
            )}
          </div>
        </div>

        {post.media && post.media.length > 0 && renderMedia()}

        <div className="ml-0 flex  py-3 pl-2 pr-1 sm:mr-0 sm:px-5 sm:pr-0">
          <p className="text-sm text-gray-600">{post.createdAt || 'Unknown Date'}</p>
        </div>

        <div className="px-5 pb-5">
          <div>
            {/* Combined Like and Comment Section */}
            <form className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                {renderLike(post)}
                <span className="ml-4 cursor-pointer text-lg" onClick={() => toggleComments(post.id)}>
                    <FaComments className="inline-block"/> Bình luận ({comments.length})
                  </span>
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
  );
};

export default Post;
