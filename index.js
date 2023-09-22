const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Path
app.use('/api/auth', userRoutes);
app.use('/api/mess', messageRoutes);

// Connect mongodb
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('DB Connect Successfully');
    })
    .catch((err) => {
        console.log(err.message);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server stated on Port ${process.env.PORT}`);
});

// Server socket
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

// Ở đây, bạn đang khởi tạo một biến toàn cục onlineUsers là một đối tượng Map.
// Đối tượng Map này được sử dụng để theo dõi người dùng đang trực tuyến trong ứng dụng.
// Mỗi cặp key-value trong Map sẽ ánh xạ một userId (ID của người dùng) vào socket.id
// (ID của kết nối Socket.IO của người dùng).
global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.message);
        }
    });
});
