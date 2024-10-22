import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../services/comment';
import { Form, Input, Button, notification } from 'antd';

const CommentForm = ({ postId, userId, onCommentAdded }) => {
  const [content, setContent] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    // Kiểm tra xem userId có hợp lệ không
    if (!userId) {
      notification.error({
        message: 'Lỗi',
        description: 'Bạn cần đăng nhập để bình luận!',
      });
      return;
    }

    const commentData = { content: values.comment, userId, postId };

    try {
      // Gửi yêu cầu thêm bình luận
      const response = await dispatch(addComment(commentData));

      // Giả sử phản hồi trả về bình luận đã được thêm với ID
      const newComment = response.payload;

      // Gọi callback sau khi bình luận đã được thêm
      if (onCommentAdded) {
        onCommentAdded(postId, newComment); // Truyền bình luận mới vào
      }

      // Hiển thị thông báo thành công
      notification.success({
        message: 'Thành công',
        description: 'Bình luận của bạn đã được đăng thành công!',
      });

      // Xóa nội dung form
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
        rules={[{ required: true, message: 'Please add a comment!' }]}
      >
        <Input.TextArea
          value={content} // Sử dụng giá trị state để điều khiển
          onChange={(e) => setContent(e.target.value)} // Cập nhật state khi người dùng nhập
          placeholder="Add a comment..."
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Comment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentForm;
