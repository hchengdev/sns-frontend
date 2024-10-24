import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment } from '../services/comment.js';
import Comment from './Comment.jsx';
import CommentForm from './CommentForm.jsx';
import { useParams } from 'react-router-dom';

const UserComment = () => {
  const dispatch = useDispatch();
  const { postId } = useParams(); // Lấy postId từ URL

  const { comments, isLoading, error } = useSelector((state) => state.comment);
  const user = JSON.parse(localStorage.getItem('sns_user'));
  const userId = user ? user.id : null;

  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    // Cập nhật danh sách bình luận của người dùng
    if (comments) {
      const filteredComments = comments.filter((comment) => comment.userId === userId);
      setUserComments(filteredComments);
    }
  }, [comments, userId]);

  const handleCommentSubmit = async (newComment) => {
    if (!userId) {
      console.error('userId không tồn tại trong localStorage');
      return; // Không tiếp tục nếu userId không tồn tại
    }

    const commentData = {
      content: newComment.content,
      userId,
      postId,
    };

    // Tạo ID tạm thời cho bình luận mới
    const tempId = Date.now(); // ID tạm thời dựa trên timestamp
    const tempComment = { ...commentData, id: tempId };

    // Cập nhật ngay danh sách bình luận
    setUserComments((prevComments) => [...prevComments, tempComment]);

    try {
      await dispatch(addComment(commentData)); // Gửi bình luận đến server
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi bình luận:', error);
      // Nếu có lỗi, bạn có thể cần xóa bình luận tạm thời
      setUserComments((prevComments) => prevComments.filter(comment => comment.id !== tempId));
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading comments: {error}</p>;
  }

  if (userComments.length === 0) {
    return <p>No comments available for this user.</p>;
  }

  return (
    <div>
      <div>
        {/* Đảm bảo truyền postId và handleCommentSubmit vào CommentForm */}
        <CommentForm postId={postId} userId={userId} onCommentAdded={handleCommentSubmit} />
      </div>
      <div>
        {userComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default UserComment;
