import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../services/post.js';
import Post from './Post';
import PostForm from './PostForm.jsx';

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.post);
  const [updatedPosts, setUpdatedPosts] = useState(posts);// State để quản lý việc hiển thị bình luận

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <div>
      <div>
        <PostForm />
      </div>

      {updatedPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div>
          {updatedPosts.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
