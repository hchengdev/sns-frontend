import { List, Avatar } from 'antd';

const CommentList = ({ comments }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={comment => {
        const avatarSrc = comment.createdBy?.profilePicture;
        const userName = comment.createdBy ? comment.createdBy.name : 'Unknown User';
        return (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={avatarSrc} />}
              title={userName}
              description={comment.content}
            />
            <div>{comment.createdAt}</div>
          </List.Item>
        );
      }}
    />
  );
};

export default CommentList;
