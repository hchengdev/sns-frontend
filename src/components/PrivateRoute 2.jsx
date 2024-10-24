import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  // console.log('private route auth ', auth)
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
