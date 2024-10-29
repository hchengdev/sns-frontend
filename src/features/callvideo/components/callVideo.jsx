import { UIKitSettingsBuilder } from '@cometchat/uikit-shared';
import { CometChatUIKit } from '@cometchat/chat-uikit-react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { useEffect, useState } from 'react';
import userService from '../../user/services/user';
import { getUserFromLocalStorage } from '../../../utils/axiosClient';
import { CometChatIncomingCall } from '@cometchat/chat-uikit-react';
import { CometChatConversationsWithMessages } from '@cometchat/chat-uikit-react';

const Cometchat = () => {
  const { getUser } = userService;
  const storedUser = getUserFromLocalStorage();
  const id = storedUser ? storedUser.id : null;

  const [user, setUser] = useState({
    name: '',
    profile_picture: '',
  });
  const [userLoaded, setUserLoaded] = useState(false);

  const COMETCHAT_CONSTANTS = {
    APP_ID: '26602972c7114741',
    REGION: 'us',
    AUTH_KEY: 'b24d589b248dd859c97be2e794a4c73ff14805c1',
  };

  const authKey = COMETCHAT_CONSTANTS.AUTH_KEY;
  const UID = `cometchat-uid-${id}`;
  const name = `${user.name}`;

  const [isInitialized, setIsInitialized] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser();
        setUser({
          profilePicture: response.profilePicture || '',
          name: response.name || '',
        });
        setUserLoaded(true);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    };
    fetchData();
  }, [getUser]);

  useEffect(() => {
    if (!userLoaded) return;

    const UIKitSettings = new UIKitSettingsBuilder()
      .setAppId(COMETCHAT_CONSTANTS.APP_ID)
      .setRegion(COMETCHAT_CONSTANTS.REGION)
      .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
      .subscribePresenceForAllUsers()
      .build();

    CometChatUIKit.init(UIKitSettings)
      .then(() => {
        CometChatUIKit.getLoggedinUser()
          .then((user) => {
            if (!user) {
              CometChatUIKit.login(UID)
                .then((user) => {
                  console.log('Đăng nhập thành công:', user);
                })
                .catch((error) => {
                  if (error.code === 'ERR_UID_NOT_FOUND') {
                    var newUser = new CometChat.User(UID);
                    newUser.setName(name);
                    CometChatUIKit.createUser(newUser, authKey)
                      .then((user) => {
                        console.log('Tạo người dùng thành công:', user);
                        CometChatUIKit.login(UID, authKey)
                          .then((loggedInUser) => {
                            console.log('Đăng nhập thành công:', loggedInUser);
                            setLoggedInUser(loggedInUser);
                          })
                          .catch(console.log);
                      })
                      .catch(console.log);
                  } else {
                    console.log('Lỗi khi đăng nhập:', error);
                  }
                });
            } else {
              setLoggedInUser(user);
            }
          })
          .catch(console.log);
        setIsInitialized(true);
      })
      .catch(console.log);
  }, [userLoaded, user, id]);
  return (
    <div className="h-[100vh] pt-[100px]">
      {isInitialized && loggedInUser ? (
        <>
          <CometChatConversationsWithMessages />
          <CometChatIncomingCall />
        </>
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="relative h-12 w-12 animate-[spin_linear_1s_infinite_alternate] rounded-full bg-white">
            <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-[#34465d]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cometchat;
