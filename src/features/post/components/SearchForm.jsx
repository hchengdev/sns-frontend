import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts, searchPosts } from '../services/post.js';
import Post from './Post';
import NavBar from '../../../components/NavBar.jsx';
import ListFollowerAndFriendUser from '../../friend/components/ListFollowerAndFriendUser.jsx';

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const {
    posts = [],
    searchResults = [],
    isLoading,
    error,
  } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      dispatch(searchPosts(searchQuery));
    }
  };

  const renderPosts = () => {
    if (searchQuery) {
      return searchResults.length > 0 ?
        searchResults.map((post) => <Post key={post.id} post={post} />) :
        <p className="text-center text-gray-500">Không tìm thấy bài viết nào với từ khóa &quot;{searchQuery}&quot;</p>;
    } else if (posts.length > 0) {
      return posts.map((post) => <Post key={post.id} post={post} />);
    } else {
      return <p className="text-center text-gray-500">Không có bài viết nào</p>;
    }
    console.log('Từ khóa tìm kiếm:', searchQuery);
    dispatch(searchPosts(searchQuery));
    if (searchQuery) {
      dispatch(searchPosts(searchQuery));
    }
  };

  const renderPosts = () => {
    if (searchQuery) {
      return searchResults.length > 0 ? (
        searchResults.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">
          Không tìm thấy bài viết nào với từ khóa &quot;{searchQuery}&quot;
        </p>
      );
    } else if (posts.length > 0) {
      return posts.map((post) => <Post key={post.id} post={post} />);
    } else {
      return <p className="text-center text-gray-500">Không có bài viết nào</p>;
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading posts: {error}</p>;
    return (
      <p className="text-center text-red-500">Error loading posts: {error}</p>
    );
  }

  return (
    <div className="flex justify-center pt-24 bg-[#f5f5f5] min-h-screen">
      <div className="w-1/5">
    <div className="flex min-h-screen justify-center bg-[#f5f5f5] pt-24">
      <div className="w-1/5">
        <NavBar />
      </div>
      <div className="flex flex-col overflow-hidden h-full mx-5 border-l border-gray-300 bg-white p-6 w-2/5 rounded-lg shadow-lg">
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} className="flex justify-center items-center pt-10">
            <div className="relative w-3/5">
          <form onSubmit={handleSubmit} method="post" className="flex justify-center items-center pt-20">
            <div className="relative w-[40%]">
      <div className="mx-5 flex h-full w-2/5 flex-col overflow-hidden rounded-lg border-l border-gray-300 bg-white p-6 shadow-lg">
        <div className="hide-scrollbar flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center pt-10"
          >
            <div className="relative w-3/5">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full border-2 border-gray-300 rounded-full p-3 pl-5 pr-14 bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out"
                className="w-full rounded-full border-2 border-gray-300 bg-gray-100 p-3 pl-5 pr-14 text-gray-700 placeholder-gray-500 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-600 hover:text-gray-800 bg-transparent focus:outline-none"
                className="absolute inset-y-0 right-0 flex items-center justify-center bg-transparent px-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>

          <div className="mt-6 posts-container">
            {renderPosts()}
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
          <div className="posts-container mt-6">{renderPosts()}</div>
        </div>
      </div>
      <div className="hidden w-1/5 lg:block">
        <div className="sticky top-24">
          <ListFollowerAndFriendUser />
        </div>
      </div>

      <div className="hidden lg:block w-1/5">
        <div className="sticky top-24">
          <ListFollowerAndFriendUser />
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
