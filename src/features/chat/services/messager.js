import axios from 'axios';

const API_URL = '/apihost/api/v1/groupMessages';

const getUserFromLocalStorage = () => {
    const user = window.localStorage.getItem('sns_user');
    if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.token;
    }
    return null;
};

// Hàm tải nhóm người dùng
export const loadUserGroups = async (userId) => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.get(`${API_URL}/${userId}/groups`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải nhóm người dùng:', error);
        throw error;
    }
};

// Hàm tải tất cả người dùng
export const loadAllUsers = async () => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.get(`${API_URL}/allUsers`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải tất cả người dùng:', error);
        throw error;
    }
};

// Hàm gửi tin nhắn
export const sendMessages = async (socket, content, groupId, userId) => {
    const message = {
        groupChat: { id: groupId },
        content,
        sender: { id: userId },
    };

    // Gửi tin nhắn qua socket
    socket.emit('chat.sendGroupMessage', message);

    // Gửi tin nhắn đến API để lưu vào cơ sở dữ liệu
    const token = getUserFromLocalStorage();
    try {
        await axios.post(`${API_URL}/addMessage`, message, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Lỗi khi lưu tin nhắn:', error);
    }
};

// Hàm tạo nhóm
export const createGroup = async (groupName, userId) => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.post(`${API_URL}/create?name=${groupName}&userId=${userId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo nhóm:', error);
        throw error;
    }
};

// Hàm tải tin nhắn
export const loadMessages = async (groupId) => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.get(`${API_URL}/${groupId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response);

        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải tin nhắn:', error);
        throw error;
    }
};

// Hàm đếm thành viên
export const countMembers = async (groupId) => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.get(`${API_URL}/${groupId}/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đếm thành viên:', error);
        throw error;
    }
};

// Hàm thêm user
export const addMemberToGroup = async (groupId, userId) => {
    const token = getUserFromLocalStorage();
    try {
        const response = await axios.post(`${API_URL}/${groupId}/addMember/${userId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm thành viên:', error);
        throw error;
    }
};
// Hàm xóa tin nhắn
export const deleteMessage = async (messageId) => {
    const token = getUserFromLocalStorage();
    try {
        await axios.delete(`${API_URL}/delete/messages/${messageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        alert('Tin nhắn đã được xóa.');
    } catch (error) {
        console.error('Lỗi khi xóa tin nhắn:', error);
        alert('Có lỗi xảy ra khi xóa tin nhắn.');
    }
};

//lưu tin nhắn 
export const messageListener = async (message, setMessages) => {
    setMessages(prevMessages => [...prevMessages, message]);

    try {
        await axios.post(`${API_URL}/addMessage`, message, {
            headers: {
                Authorization: `Bearer ${getUserFromLocalStorage()}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Lỗi khi lưu tin nhắn:', error);
    }
};