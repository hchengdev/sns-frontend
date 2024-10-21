import http from 'http';
import { Server } from 'socket.io';

// Tạo server HTTP
const server = http.createServer();

// Khởi tạo Socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Khi có người dùng kết nối
io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối:', socket.id);

    // Người dùng tham gia nhóm
    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} đã tham gia nhóm ${groupId}`);
    });

    // Nhận tin nhắn và phát đến nhóm
    socket.on('chat.sendGroupMessage', (message) => {
        console.log('Tin nhắn nhận được:', message);
        io.to(message.groupChat.id).emit('chat.message', message);
    });

    // Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối:', socket.id);
    });
});

// Khởi động server
server.listen(8089, () => {
    console.log('Máy chủ đang chạy trên http://localhost:8089');
});
