// LoginHandler.jsx
import { useEffect, useState } from 'react';
import { CometChat } from '@cometchat-pro/chat';
import userService from '../../user/services/user';

const LoginHandler = () => {
  const { getUser } = userService;
  const [user, setUser] = useState({
    name: '',
    email: '',
    profile_picture: '',
    biography: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser();
        setUser({
          email: response.email || '',
        });
        console.log('User email: ' + response.email);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchData();
  }, [getUser]);

  useEffect(() => {
    const appId = '2659213675dbee2c';
    const appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion('us')
      .build();

    CometChat.init(appId, appSettings).then(
      () => {
        console.log('Initialization completed successfully');
        const authKey = '09bb9cb5972fb724637f56a3f40175cfd9c737fc';
        const uid = user.email.replace(/[@.]/g, '_');

        if (uid) {
          CometChat.login(uid, authKey).then(
            (user) => {
              console.log('User logged in successfully:', user);
            },
            (error) => {
              console.log('Error logging in user:', error);
            },
          );
        }
      },
      (error) => {
        console.log('Initialization failed with error:', error);
      },
    );
  }, [user.email]);

  return null; // Không cần render gì ở đây
};

export default LoginHandler;
