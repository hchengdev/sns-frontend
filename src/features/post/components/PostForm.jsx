import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../services/post';
import { BsFillImageFill } from 'react-icons/bs';
import { FaEarthAmericas, FaLock, FaUserGroup } from 'react-icons/fa6';

const PostForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.post);

  const [postImage, setPostImage] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPostImage(file);
    }
  };

  const handlePostSubmit = async () => {
    if (!content) {
      setError('Nội dung bài đăng không được để trống');
      return;
    }

    setError(null);

    try {
      await dispatch(createPost({
        content,
        userId: user.id,
        visibility,
        file: postImage,
      }));

      setContent('');
      setPostImage(null);
      setVisibility('PUBLIC');
    } catch {
      setError('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleVisibilityChange = (value) => {
    setVisibility(value);
    setDropdownOpen(false);
  };

  return (
    <div className="modal-class py-5">
      <div className="flex px-5 py-3 border border-l border-solid border-zinc-300 bg-white shadow-md rounded-lg">
        <div className="mt-3 h-12 w-12 flex-none text-lg">
          <img src="/logo_img.png" className="h-12 w-12 flex-none rounded-full" alt="avatar" />
        </div>

        <div className="w-full px-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="mt-3 h-14 w-full resize-none rounded-xl bg-slate-100 p-2 pb-3 focus:outline-none"
          />

          {postImage && (
            <div className="mx-auto max-h-80 max-w-xl rounded-md">
              <img
                src={URL.createObjectURL(postImage)}
                className="my-2 block max-h-20 max-w-full cursor-pointer rounded-md"
                alt="postImage"
              />
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex items-center justify-between my-3">
            <div className="relative">
              {content && (
                <button
                  className="flex items-center rounded-md border border-gray-300 p-2"
                  onClick={toggleDropdown}
                >
                  {visibility === 'PUBLIC' && <FaEarthAmericas className="mr-2" />}
                  {visibility === 'PRIVATE' && <FaLock className="mr-2" />}
                  {visibility === 'FRIENDS' && <FaUserGroup className="mr-2" />}
                  <span>{visibility === 'PUBLIC' ? 'Công khai' : visibility === 'PRIVATE' ? 'Riêng tư' : 'Bạn bè'}</span>
                </button>
              )}

              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-300 rounded-md w-full z-[1000]">
                  {['PUBLIC', 'PRIVATE', 'FRIENDS'].map((vis) => (
                    <div
                      key={vis}
                      className="p-2 cursor-pointer flex items-center hover:bg-gray-100"
                      onClick={() => handleVisibilityChange(vis)}
                    >
                      {vis === 'PUBLIC' && <FaEarthAmericas className="mr-2" />}
                      {vis === 'PRIVATE' && <FaLock className="mr-2" />}
                      {vis === 'FRIENDS' && <FaUserGroup className="mr-2" />}
                      <span>{vis === 'PUBLIC' ? 'Công khai' : vis === 'PRIVATE' ? 'Riêng tư' : 'Bạn bè'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {content && (
              <label className="m-2 flex items-center" title="Chọn ảnh">
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <BsFillImageFill className="mt-1 cursor-pointer text-2xl text-blue-700" />
              </label>
            )}
          </div>

          {content && (
            <div className="flex justify-between">
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-800 hover:shadow-lg disabled:cursor-not-allowed"
                onClick={handlePostSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng...' : 'Đăng Bài'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;