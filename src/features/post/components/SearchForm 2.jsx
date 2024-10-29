import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, searchPosts } from '../services/post.js';
import Post from './Post';
import NavBar from '../../../components/NavBar.jsx';

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { posts = [], searchResults = [], isLoading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Từ khóa tìm kiếm:', searchQuery);
    dispatch(searchPosts(searchQuery));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading posts: {error}</p>;
  }

  return (
    <div className="flex justify-center pt-[100px] bg-[#f5f5f5]">
      <div className="w-[15%]">
        <NavBar />
      </div>
      <div className="flex flex-col overflow-hidden h-[100vh] mx-5 border-solid border-l-zinc-400 bg-[#fff] px-[20px] py-[5px] w-[50%]">
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} method="post" className="flex justify-center items-center pt-20">
            <div className="relative w-[40%]">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full border-2 border-gray-300 rounded-full p-3 pl-5 pr-14 bg-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-700 bg-transparent focus:outline-none"
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-700" />
              </button>
            </div>
          </form>

          <div className="mt-5 posts-container">
            {searchResults.length > 0 ? (
              searchResults.map((post) => (
                <Post key={post.id} post={post} />
              ))
            ) : (
              posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <p>No posts available</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
