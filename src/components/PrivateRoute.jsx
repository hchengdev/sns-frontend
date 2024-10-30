import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const Layout = () => (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
  );

  console.log('Authenticated in PrivateRoute:', isAuthenticated);

  return isAuthenticated ? <Layout /> : <Navigate to="/login" />;
};

export default PrivateRoute;
