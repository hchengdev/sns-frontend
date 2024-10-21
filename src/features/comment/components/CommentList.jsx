
import { List, Avatar } from 'antd';
import Comment from './Comment';
import { useEffect, useState } from 'react';

const CommentList = ({ comments, onUpdate }) => {
  const [updatedComments, setUpdatedComments] = useState(comments);

  useEffect(() => {
    setUpdatedComments(comments);
  }, [comments]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={updatedComments}
      renderItem={comment => {
        const avatarSrc = comment.createdBy?.profilePicture
          ? `http://localhost:3002${comment.createdBy.profilePicture}`
          : '/default-avatar.png';

        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={avatarSrc} />}
              title={
                <div>
                  <span>{comment.createdBy?.name || 'Unknown User'}</span>
                  <Comment comment={comment} showOptions={true} onUpdate={onUpdate} />
                </div>
              }
              description={comment.createdAt || 'Unknown Date'}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default CommentList;
