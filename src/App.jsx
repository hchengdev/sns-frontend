import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginForm from './features/auth/components/LoginForm';
import RegisterForm from './features/auth/components/RegisterForm';
import Home from './components/Home';
import UpdateProfile from './features/user/components/UpdateProfile';
import UserProfile from './features/user/components/Profile';
import AllListFriend from './features/friend/components/AllListFriend';
import AllListFollowers from './features/friend/components/AllListFollowers';
import { ToastContainer } from 'react-toastify';
import ChatApp from './features/chat/components/messger';
import UpdatePassword from './features/user/components/EditPassword.jsx';
import FriendProfile from './features/friend/components/FriendProfile';
import UserList from './features/user/components/UserSearchList';
import Cometchat from './features/callvideo/components/callVideo.jsx';

import Comments from './features/comment/components/Comment';
import SearchForm from './features/post/components/SearchForm'
import Notifications from './features/notifications/components/Notifications.jsx';
import UserSearchList from './features/user/components/UserSearchList.jsx';
import PrivateRoute from "./components/PrivateRoute.jsx";
import EmailConfirmation from './features/user/components/SearchAccount.jsx';
import ResetPassword from './features/user/components/ForgotPassword.jsx';



const App = () => {
    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/posts" element={<SearchForm />} />
                    <Route path="/forgot-password" element={<EmailConfirmation />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/update-profile" element={<UpdateProfile />} />
                            <Route path="/me" element={<UserProfile />} />
                            <Route path="/list-friend" element={<AllListFriend />} />
                            <Route path="/list-followers" element={<AllListFollowers />} />
                            <Route path="/update-password" element={<UpdatePassword />} />
                            <Route path="/posts/:postId/comments" element={<Comments />} />
                            <Route path='/messager' element={<ChatApp />} />
                            <Route path="/users/:id" element={<FriendProfile />} />
                            <Route path="/search-users" element={<UserList />} />
                            <Route path="/cometchat" element={<Cometchat />} />
                            <Route path="/search-users" element={<UserSearchList />} />
                    </Route>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    {/*<Route path="/admin" element={<Dashboard />} />*/}
                </Routes>
            </BrowserRouter>
        </>
)
};

export default App;
