import NavBar from './NavBar';
import PostList from '../features/post/components/PostList';
import ListFriend from '../features/friend/components/ListFollowerAndFriendUser';

export default function Home() {
  return (
    <div className="grid grid-cols-1 justify-center gap-4 bg-[#f5f5f5] pt-[100px] md:grid-cols-12">
      {/* NavBar */}
      <div className="col-span-2 col-start-1 hidden w-full md:col-span-2 md:col-start-2 md:inline-block">
        <NavBar />
      </div>

      {/* Post List */}
      <div className="col-span-5 mx-2 mb-10 h-auto w-full">
        <div className="hide-scrollbar flex-1 overflow-y-auto px-4 pb-6">
          <PostList />
        </div>
      </div>

      {/* Friend List */}
      <div className="col-span-2 hidden w-[130%] md:block">
        <div className="sticky top-[100px]">
          <ListFriend />
        </div>
      </div>
    </div>
  );
}