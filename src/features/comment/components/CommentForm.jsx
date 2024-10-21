import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../services/comment';
import { Form, Input, Button, notification } from 'antd';

const CommentForm = ({ postId, userId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if (!userId) {
      notification.error({
        message: 'Lỗi',
        description: 'Bạn cần đăng nhập để bình luận!',
      });
      return;
    }

    const commentData = { content: values.comment, userId, postId };

    try {
      const response = await dispatch(addComment(commentData));
      const newComment = response.payload;

      if (onCommentAdded) {
        onCommentAdded(postId, newComment);
      }

      notification.success({
        message: 'Thành công',
        description: 'Bình luận của bạn đã được đăng thành công!',
      });

      setContent('');

    } catch (error) {
      console.error('Error adding comment:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi thêm bình luận!',
      });
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="comment"
        rules={[{ required: true, message: 'Vui lòng thêm bình luận!' }]}
      >
        <Input.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Thêm bình luận..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Bình luận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;