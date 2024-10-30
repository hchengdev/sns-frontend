import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../services/post';
import Post from './Post';
import PostForm from './PostForm.jsx';

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.post);
  const [updatedPosts, setUpdatedPosts] = useState([]);

  useEffect(() => {
    // Tải tất cả các bài đăng khi component được mount
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    // Cập nhật state của updatedPosts khi posts thay đổi
    setUpdatedPosts(posts);
  }, [posts]);

  // const addNewPost = (newPost) => {
  //   // Thêm bài đăng mới vào đầu danh sách
  //   setUpdatedPosts((prevPosts) => [newPost, ...prevPosts]);
  // };
  const sortedPosts = [...updatedPosts].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center">
      <div className="relative h-12 w-12 animate-[spin_linear_1s_infinite_alternate] rounded-full bg-white">
        <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#34465d]"></div>
      </div>
    </div>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <div>
      <PostForm />
      {updatedPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div>
          {sortedPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
