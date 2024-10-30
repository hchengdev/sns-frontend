import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '../services/post';
import Post from './Post';
import PostForm from './PostForm.jsx';
import { Link, useParams } from 'react-router-dom';

const FriendPost = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector((state) => state.post);
  const user = JSON.parse(localStorage.getItem('sns_user'));
  const { id } = useParams();
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  const userPosts = posts.filter((post) => post.userId === id);

  if (userPosts.length === 0) {
    return <p>No posts available for this user.</p>;
  }


  return (
    <div className={'w-[75vh]'}>
      <PostForm />
      <div>
        {userPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default FriendPost;