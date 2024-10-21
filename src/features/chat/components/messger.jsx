import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { getUserFromLocalStorage } from '../../../utils/axiosClient';
import {
    loadUserGroups,
    loadAllUsers,
    sendMessages,
    createGroup,
    loadMessages,
    countMembers,
    addMemberToGroup,
    deleteMessage
} from '../services/messager';
import { Button } from 'antd';
import { DeleteOutlined, UserAddOutlined, UsergroupAddOutlined, MessageOutlined, TeamOutlined, SmileOutlined } from '@ant-design/icons';

const socket = io('http://localhost:8089');
const DEFAULT_PROFILE_PIC = 'https://via.placeholder.com/40';

const connectSocket = (setSocket) => {
    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            console.log('Connected to Socket.io');
            setSocket(socket);
            resolve();
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.io connection error:', error);
            reject(error);
        });
    });
};

const storedUser = getUserFromLocalStorage();
const id = storedUser ? storedUser.id : null;

const ChatApp = () => {
    const [userId] = useState(id);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [usersMap, setUsersMap] = useState({});
    const [messages, setMessages] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [groupName, setGroupName] = useState('');
    const [memberCount, setMemberCount] = useState(0);
    const [userList, setUserList] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [showMemberList, setShowMemberList] = useState(false); // New state for member list visibility
    const [socketInstance, setSocket] = useState(null);
    const [messageInfoVisible, setMessageInfoVisible] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const emojis = ['😀', '😂', '😍', '😎', '😢', '😡', '👍', '🎉', '❤️', '🙌'];

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const connect = async () => {
            try {
                await connectSocket(setSocket);
                await loadUserGroupsData();
                await loadAllUsersData();
            } catch (error) {
                console.error('Socket connection error:', error);
            }
        };
        connect();

        const messageListener = (message) => {
            if (message.sender.id !== userId) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        };

        if (socketInstance) {
            socketInstance.on('chat.message', messageListener);
        }

        return () => {
            if (socketInstance) {
                socketInstance.off('chat.message', messageListener);
            }
        };
    }, [socketInstance]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const loadUserGroupsData = async () => {
        const groups = await loadUserGroups(userId);
        setUserGroups(groups);
        if (groups.length > 0) selectGroup(groups[0].id);
    };

    const loadAllUsersData = async () => {
        try {
            const users = await loadAllUsers();
            if (Array.isArray(users)) {
                setUserList(users);
                const map = {};
                users.forEach(user => {
                    map[user.id] = user.name || 'Unknown User';
                });
                setUsersMap(map);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const sendMessage = async () => {
        if (!messageContent || !selectedGroupId) return alert('Please enter a message and select a group.');

        const newMessage = {
            content: messageContent,
            sender: { id: userId, name: usersMap[userId] },
            timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        await sendMessages(socketInstance, messageContent, selectedGroupId, userId);

        setMessageContent('');
    };

    const createNewGroup = async () => {
        if (!groupName) return alert('Please enter a group name.');
        try {
            const group = await createGroup(groupName, userId);
            alert(`Group created: ${group.name}`);
            loadUserGroupsData();
            setGroupName('');
        } catch (error) {
            alert('Failed to create group: ' + error.message);
        }
    };

    const selectGroup = async (groupId) => {
        setSelectedGroupId(groupId);
        socket.emit('joinGroup', groupId);
        const loadedMessages = await loadMessages(groupId);
        setMessages(loadedMessages);

        const members = await countMembers(groupId);
        setMemberCount(members.length);

        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleUserList = () => {
        setShowUserList(!showUserList);
    };

    const toggleMemberList = () => {
        setShowMemberList(!showMemberList); // Toggle member list visibility
    };

    const selectUser = (user) => {
        if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            setSelectedUsers(prev => prev.filter(selectedUser => selectedUser.id !== user.id));
        } else {
            setSelectedUsers(prev => [...prev, user]);
        }
        setShowUserList(false);
    };

    const addMember = async () => {
        if (selectedUsers.length === 0 || !selectedGroupId) return alert('Please select a user to add.');
        try {
            await Promise.all(selectedUsers.map(user => addMemberToGroup(selectedGroupId, user.id)));
            alert(`Users added to group.`);
            setSelectedUsers([]);
            await loadUserGroupsData();
        } catch (error) {
            console.error('Error adding members:', error);
            alert('User already exists in the group');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage(messageId);
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('An error occurred while deleting the message.');
        }
    };

    const handleMessageClick = (messageId) => {
        setMessageInfoVisible(prevId => (prevId === messageId ? null : messageId));
    };

    const addEmoji = (emoji) => {
        setMessageContent(prev => prev + emoji);
        setEmojiPickerVisible(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50" style={{ marginTop: '4rem', height: '46rem' }}>
            <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold shadow-md">
                <MessageOutlined /> Group Chat
            </header>
            <div className="flex flex-grow">
                {/* Left Side: Create Group and User List */}
                <div className="w-1/4 p-4 border-r border-gray-300 bg-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2"><UsergroupAddOutlined /> Create New Group:</h3>
                    <input
                        type="text"
                        placeholder="Group name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full mb-2"
                    />
                    <button onClick={createNewGroup} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-300 w-full">
                        Create Group
                    </button>
                    <span className="ml-2">Members: {memberCount}</span>
                    <h3 className="font-bold text-lg mt-4">Members in Group:</h3>
                    <button onClick={toggleMemberList} className="bg-blue-600 text-white p-2 rounded-lg mb-2 hover:bg-blue-700 transition duration-300 w-full">
                        {showMemberList ? 'Hide Members' : 'Show Members'}
                    </button>
                    {showMemberList && (
                        <div className="mb-4">
                            {userGroups.find(group => group.id === selectedGroupId)?.members.map(member => (
                                <div key={member.id} className="flex items-center p-2 border-b border-gray-200">
                                    <img
                                        src={member.profilePicture ? `/apihost/image/${member.profilePicture}` : DEFAULT_PROFILE_PIC}
                                        className="w-10 h-10 rounded-full"
                                        alt={member.name || 'Unknown Member'}
                                    />
                                    <span className="ml-2">{member.name || 'Unknown Member'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <h3 className="font-bold text-lg mb-2"><UserAddOutlined /> Add Member:</h3>
                    <button onClick={toggleUserList} className="bg-blue-600 text-white p-2 rounded-lg mb-2 hover:bg-blue-700 transition duration-300 w-full">
                        Toggle User List
                    </button>
                    {showUserList && (
                        <ul className="list-none max-h-40 overflow-y-auto border border-gray-300 p-2 mb-2 rounded-lg">
                            {userList.map(user => (
                                <li
                                    key={user.id}
                                    className={`flex items-center cursor-pointer p-2 hover:bg-blue-100 ${selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'bg-green-200' : ''}`}
                                    onClick={() => selectUser(user)}
                                >
                                    <img
                                        src={user.profilePicture ? `/apihost/image/${user.profilePicture}` : DEFAULT_PROFILE_PIC}
                                        className="w-10 h-10 rounded-full"
                                        alt={user.name || 'Unknown Member'}
                                    />
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-2">
                        <strong>Selected Users:</strong> {selectedUsers.map(user => user.name).join(', ')}
                    </div>
                    <button onClick={addMember} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-2">Confirm Add</button>
                </div>

                {/* Middle: Message Display */}
                <div className="flex-grow p-4 flex flex-col">
                    <div className="text-xl font-bold mb-4">
                        {selectedGroupId && userGroups.find(group => group.id === selectedGroupId)?.name}
                    </div>
                    <div className="flex-grow overflow-y-auto border border-gray-300 p-4 mb-4 rounded-lg bg-white shadow-lg" style={{ maxHeight: '400px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-2 ${msg.sender.id === userId ? 'justify-end' : ''}`} onClick={() => handleMessageClick(msg.id)}>
                                <div className={`flex items-center p-2 rounded-lg ${msg.sender.id === userId ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                    <strong>{usersMap[msg.sender.id]}:</strong> {msg.content}
                                    {messageInfoVisible === msg.id && (
                                        <div className="flex items-center mt-1 text-black">
                                            <span className="text-gray-500 text-xs">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                            {msg.sender.id === userId && (
                                                <Button
                                                    type="link"
                                                    icon={<DeleteOutlined style={{ color: 'black' }} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteMessage(msg.id);
                                                    }}
                                                    className="ml-2"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* Phần cuộn xuống */}
                    </div>
                    <div className="flex items-center mb-2">
                        <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} className="text-gray-600 hover:text-blue-600 mr-2">
                            <SmileOutlined />
                        </button>
                        {emojiPickerVisible && (
                            <div className="flex mt-2">
                                {emojis.map((emoji, index) => (
                                    <button key={index} onClick={() => addEmoji(emoji)} className="p-1 text-2xl">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-300">Send</button>
                    </div>
                </div>

                {/* Right Side: User Groups */}
                <aside className="w-1/4 p-4 border-l border-gray-300 bg-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2"><TeamOutlined /> Your Groups:</h3>
                    <ul className="list-none mb-4">
                        {userGroups.map(group => (
                            <li
                                key={group.id}
                                className={`cursor-pointer p-2 hover:bg-blue-100 ${selectedGroupId === group.id ? 'bg-blue-200' : ''}`}
                                onClick={() => selectGroup(group.id)}
                            >
                                <div className="flex items-center">
                                    <UsergroupAddOutlined className="text-blue-600 mr-2" style={{ fontSize: '24px' }} />
                                    <span className="ml-2">{group.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default ChatApp;
