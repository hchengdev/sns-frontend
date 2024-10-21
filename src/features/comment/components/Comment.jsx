import { HiDotsHorizontal } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReply, deleteComment, updateComment, toggleLikeComment } from '../services/comment';
import { toast } from 'react-toastify';
import { List, Avatar } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const Comment = ({ comment, showOptions, onUpdateComment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user ? user.id : null;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [likeState, setLikeState] = useState({
    isLiked: comment.likes?.likeByUsers?.includes(userId) || false,
    likeCount: comment.likes?.likeCount || 0,
    likedByUsers: comment.likes?.likeByUsers || []
  });
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    setContent(comment.content);
    setLikeState({
      isLiked: comment.likes?.likeByUsers?.includes(userId) || false,
      likeCount: comment.likes?.likeCount || 0,
      likedByUsers: comment.likes?.likeByUsers || []
    });
  }, [comment, userId]);

  const handleLike = async () => {
    const { isLiked } = likeState;
    try {
      const response = await dispatch(toggleLikeComment(comment.id)).unwrap();
      if (response && response.likeCount !== undefined) {
        setLikeState(prev => ({
          ...prev,
          isLiked: !isLiked,
          likeCount: response.likeCount,
          likedByUsers: response.likedByUsers || []
        }));
        const likedComments = JSON.parse(localStorage.getItem('likedComments')) || {};
        likedComments[comment.id] = !isLiked;
        localStorage.setItem('likedComments', JSON.stringify(likedComments));
      } else {
        throw new Error('LikeCount không có trong phản hồi');
      }
    } catch (error) {
      console.error('Thao tác thích không thành công:', error);
      toast.error('Có lỗi xảy ra khi thực hiện thao tác thích.');
    }
  };

  const toggleOptions = () => setOptionsVisible(prev => !prev);

  const handleDeleteComment = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await dispatch(deleteComment(comment.id)).unwrap();
        toast.success('Bình luận đã được xóa thành công!');
        onUpdateComment(comment.id);
      } catch (error) {
        console.error('Xóa bình luận không thành công:', error);
      }
    }
  };

  const handleEditComment = async () => {
    if (!content.trim()) {
      toast.error('Nội dung không được để trống!');
      return;
    }

    try {
      await dispatch(updateComment({ commentId: comment.id, content })).unwrap();
      toast.success('Bài đăng đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Cập nhật bình luận không thành công:', error);
      toast.error('Có lỗi xảy ra khi cập nhật bình luận.');
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Nội dung phản hồi không được để trống!');
      return;
    }

    const replyData = {
      postId: comment.postId,
      content: replyContent,
      userId: user.id,
      commentId: comment.id
    };

    try {
      const result = await dispatch(addReply(replyData)).unwrap();
      comment.replies.push({ ...result, createdBy: user });
      setReplyContent('');
      toast.success('Phản hồi đã được gửi thành công!');
    } catch (error) {
      console.error('Gửi phản hồi không thành công:', error);
    }
  };

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

  return (
    <div className="comment">
      <div className="comment-header flex justify-between items-center">
        <span className="font-semibold">{comment.authorName}</span>
        {userId === comment.userId && showOptions && (
          <div className="relative">
            <HiDotsHorizontal className="mr-3 cursor-pointer" onClick={toggleOptions} />
            {optionsVisible && (
              <div className="absolute right-7 top-0 z-20 rounded-xl border border-slate-300 bg-white font-semibold text-slate-600 shadow-xl">
                <ul className="cursor-pointer text-start">
                  <li
                    className="rounded-xl px-5 py-2 hover:bg-slate-200"
                    onClick={() => {
                      setIsEditing(true);
                      setOptionsVisible(false);
                    }}
                  >
                    Cập nhật
                  </li>
                  <li
                    className="rounded-xl px-5 py-2 hover:bg-slate-200"
                    onClick={() => {
                      handleDeleteComment();
                      setOptionsVisible(false);
                    }}
                  >
                    Xóa
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="comment-body mt-2">
        {isEditing ? (
          <div>
            <textarea
              className="w-full border p-2 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded mr-2"
                onClick={handleEditComment}
              >
                Lưu
              </button>
              <button
                className="px-4 py-1 bg-gray-300 rounded"
                onClick={() => {
                  setIsEditing(false);
                  setOptionsVisible(false);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      <div className="comment-footer mt-2 flex justify-between items-center">
        {renderLike()}
        <button
          className="text-blue-500 underline"
          onClick={() => setShowReplies(prev => !prev)}
        >
          {showReplies ? 'Ẩn phản hồi' : `Hiện phản hồi (${comment.replies.length})`}
        </button>
      </div>

      {showReplies && (
        <div className="replies mt-4">
          <h4 className="font-semibold">Phản hồi ({comment.replies.length}):</h4>
          <List
            itemLayout="horizontal"
            dataSource={comment.replies}
            renderItem={reply => {
              const avatarSrc = reply.createdBy?.profilePicture
                ? `http://localhost:3002${reply.createdBy.profilePicture}`
                : '/default-avatar.png';

              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={avatarSrc} />}
                    title={<span>{reply.createdBy?.name || 'Unknown User'}</span>}
                    description={reply.createdAt || 'Unknown Date'}
                  />
                  <p>{reply.content}</p>
                </List.Item>
              );
            }}
          />
          <div className="reply-form mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              className="w-full border p-2 rounded"
            />
            <button onClick={handleReply} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">
              Gửi phản hồi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;