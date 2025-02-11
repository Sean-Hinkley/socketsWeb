const express = require('express');
const http = require('http');

const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    res.render('index');
    
});


const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('chat message', (data) => {
        io.emit('chat message', {user: socket.username, message: data});
    });

    socket.on('username', (data) => {
        socket.username = data;
    });

    socket.on('createRoom', (data) => {
        socket.currentRoom = data.room;
        socket.join(data.room);
        io.to(data.room).emit('roomCreated', {user: socket.username, room: data.room});
    });

    
    socket.on('messageRoom', (data) => {
        console.log(socket.currentRoom);
        io.to(socket.currentRoom).emit("roomMessage", {user: socket.username, message: data.message})
    });
});

server.listen(3000, () => {
    console.log('started on: http://localhost:3000');
});
