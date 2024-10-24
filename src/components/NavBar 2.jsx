import { Link, useLocation } from 'react-router-dom';
import { FaList, FaRegUser, FaUser } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';

const NavBar = () => {
  const location = useLocation();

  return (
    <aside className="mt-[40px] hidden sm:block">
      <nav>
        <ul className="px-2">
          {/* Explore Link */}
          <li>
            <Link
              to="/"
              className={`flex cursor-pointer gap-3 rounded-[15rem] px-3 py-4 hover:bg-slate-200 active:bg-slate-100 ${
                location.pathname === '/' ? 'font-bold' : ''
              }`}
            >
              {location.pathname === '/' ? (
                <>
                  <FaHouse className="text-[1.6rem] font-bold" />
                  <h2 className="hidden px-1 text-xl font-bold xl:block">
                    Trang chủ

                  </h2>
                </>
              ) : (
                <>
                  <FaHouse className="text-[1.6rem]" />
                  <h2 className="hidden px-1 text-xl xl:block">Trang chủ</h2>
   </>
              )}
            </Link>
          </li>

          {/* Profile Link */}
          <li>
            <Link
              to="/me"
              className={`flex cursor-pointer gap-3 rounded-[15rem] px-3 py-4 hover:bg-slate-200 active:bg-slate-100 ${
                location.pathname === '/me' ? 'font-bold' : ''
              }`}
            >
              {location.pathname === '/me' ? (
                <>
                  <FaUser className="text-[1.6rem] font-bold" />
                  <h2 className="hidden px-1 text-xl font-bold xl:block">
                    Hồ sơ

                  </h2>
                </>
              ) : (
                <>
                  <FaRegUser className="text-[1.6rem]" />
                  <h2 className="hidden px-1 text-xl xl:block">Hồ sơ</h2>
                </>
              )}
            </Link>
          </li>


          <li>
            <Link
              to="/posts"
              className={`flex cursor-pointer gap-3 rounded-[15rem] px-3 py-4 hover:bg-slate-200 active:bg-slate-100 ${
                location.pathname === '/posts' ? 'font-bold' : ''
              }`}
            >
              {location.pathname === '/posts' ? (
                <>
                  <FaList className="text-[1.6rem] font-bold" />
                  <h2 className="hidden px-1 text-xl font-bold xl:block">
                    Bài đăng
                  </h2>
                </>
              ) : (
                <>
                  <FaList icon="fa-solid fa-list" className="text-[1.6rem]" />
                  <h2 className="hidden px-1 text-xl xl:block">Bài đăng</h2>
                </>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;