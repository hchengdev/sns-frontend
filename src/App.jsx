import { Outlet, Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import Home from './features/home/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import UpdateProfile from './features/user/components/UpdateProfile';
import UserProfile from './features/user/components/Profile';
import UpdatePassword from './features/user/components/UpdatePassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            {/* Bảo vệ các route sau bằng PrivateRoute */}
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/me" element={<UserProfile />} />

            <Route path="/update-password" element={<UpdatePassword />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
