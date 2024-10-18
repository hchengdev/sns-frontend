import { Outlet, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import UpdateProfile from './features/user/components/UpdateProfile';
import UserProfile from './features/user/components/Profile';
import AllListFriend from './features/friend/components/AllListFriend';
import 'react-toastify/dist/ReactToastify.css';
import AllListFollowers from './features/friend/components/AllListFollowers';
import { ToastContainer } from 'react-toastify';
import UpdatePassword from './features/user/components/EditPassword.jsx';
import FriendProfile from './features/friend/components/FriendProfile';
import UserList from './features/user/components/UserSearchList';

// import Comments from './features/comment/components/Comment';
// import Dashboard from './features/admin/components/Dashboard';
// import SearchForm from './features/post/components/SearchForm'

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/me" element={<UserProfile />} />
            <Route path="/list-friend" element={<AllListFriend />} />
            <Route path="/list-followers" element={<AllListFollowers />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/users/:id" element={<FriendProfile />} />
            <Route path="/search-users" element={<UserList />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/*<Route path="/admin" element={<Dashboard />} />*/}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
