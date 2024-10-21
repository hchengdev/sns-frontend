import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment } from '../services/comment';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useParams } from 'react-router-dom';

const UserComment = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const { comments, isLoading, error } = useSelector((state) => state.comment);

  const user = JSON.parse(localStorage.getItem('sns_user'));
  const userId = user ? user.id : null;

  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  useEffect(() => {
    if (comments) {
      const filteredComments = comments.filter((comment) => comment.userId === userId);
      setUserComments(filteredComments);
    }
  }, [comments, userId]);

  const handleCommentSubmit = async (newComment) => {
    if (!userId) {
      console.error('userId không tồn tại trong localStorage');
      return;
    }

    const commentData = {
      content: newComment.content,
      userId,
      postId,
    };

    try {
      const response = await dispatch(addComment(commentData));
      if (response && response.id) {
        setUserComments((prevComments) => [
          ...prevComments,
          { ...commentData, id: response.id },
        ]);
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi bình luận:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading comments: {error}</p>;
  if (userComments.length === 0) return <p>No comments available for this user.</p>;

  return (
    <div>
      <CommentForm postId={postId} userId={userId} onCommentAdded={handleCommentSubmit} />
      <div>
        {userComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default UserComment;