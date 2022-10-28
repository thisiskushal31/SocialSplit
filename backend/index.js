const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const axios = require('axios');

require('dotenv').config();

const {
    addUser,
    removeUser,
    getUserByName,
    getUserById,
    enterRoom,
    leaveRoom,
    getUsersInRoom,
    getAll
} = require('./users');

const PORT = process.env.PORT || 5000;
const URL = `http://localhost:${PORT}`;

// request handlers
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const friendRouter = require('./routes/friend');

//set up
const app = express();  // creates an express app instance
const server = http.createServer(app);  // creates a http server instance
const io = socketio(server);

io.eio.pingTimeout = 30 * 60 * 1000;  // clients will be disconnected from the server after 30 mins idling.
io.eio.pingInterval = 1 * 60 * 1000;  //send a ping packet to check if clients are active every minute

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/friends', friendRouter);

// each socket fires a special disconnect event.
io.on('connect', (socket) => {
    socket.on('addUser', ({nickname, soid, icon}, callback) => {
        if(addUser({nickname, soid, icon})) {
            io.emit('update');
        }

        callback();
    })

    socket.on('reconnect_attempt', () => {
        console.log('rectonnect attemp.');
        socket.io.opts.transports = ['polling', 'websocket'];
    });

    //listen on 'join' event from the client side
    socket.on('join', ({ nickname, room, icon}, callback) => {
        const user = enterRoom(nickname, room);

        //let the current user joins the room
        socket.join(user.room);
        // emitting events from the server side to the client side:
        // 1. send a welcome msg to the current user
        // 2. let other users know the current user has joined the room
        socket.emit('message', {user: 'Admin', text: `Welcome to Room ${user.room}, ${user.nickname}.`, icon: 0});
        socket.broadcast.to(user.room).emit('message', {user: 'Admin', text: `${user.nickname}, has joined the room.`});

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

        callback();
    });

    socket.on('leave', (callback) => {
        const user = getUserById(socket.id);

        if(user) {
        const room = user.room;
        leaveRoom(socket.id);

        socket.leave(room, () => {
            io.to(room).emit('message', {user: 'Admin', text: `${user.nickname} has left the room.`, icon: 0});
            io.to(room).emit('roomData', {room: room, users: getUsersInRoom(room)})  // someone left, update the room data
        });
        }

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUserById(socket.id);
        if(user) {
        io.to(user.room).emit('message', {user: user.nickname, text: message, icon: user.icon});
        }

        callback();
    });

    socket.on('sendPrivateMessage', ({soid, message}, callback) => {
        const user = getUserById(socket.id);

        if(user) {
        io.to(soid).emit('getPrivateMessage', {user: user.nickname, text: message, icon: user.icon});
        }

        callback();
    })


    socket.on('addFriend', ({token, username, friend_id, friend}) => {
        const user = getUserById(socket.id);

        if(user) {
        const cur_user = {
            nickname: user.nickname,
            soid: user.soid,
            icon: user.icon,
        };

        io.to(friend_id).emit('friendReuqest', cur_user);  // nickname
        axios.post(`${URL}/friends/request/${friend}`, { username: username, nickname: user.nickname }, {headers: { Cookie: token }})
            .then(res => {})
            .catch(err => console.log(err));
        }
    })

    socket.on('acceptFriend', ({token, username, friend_id, friend}) => {
        const user = getUserById(socket.id);
        if(user) {
        const cur_user = {
            nickname: user.nickname,
            soid: user.soid,
            icon: user.icon,
        };

        io.to(friend_id).emit('requestAccepted', cur_user);
        axios.post(`${URL}/friends/accept/${friend}`, { username: username, nickname: user.nickname }, {headers: { Cookie: token }})
            .then(res => {})
            .catch(err => console.log(err));
        }
    })

    socket.on('getFriends', ({nickname, username, token}, callback) => {
        const user = getUserByName(nickname);
        if(user) {
        axios.post(`${URL}/friends/${nickname}`, { username: username }, {headers: { Cookie: token }})
            .then(res => callback(res.data))
            .catch(err => console.log(err));
        }
        else {
        callback()
        }
    })

    //listen on 'disconnect' event from the client side
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        io.emit('update');  // update others' list when someone is offline

        if(user && user.room) {
        socket.leave(user.room, () => {
            io.to(user.room).emit('message', {user: 'Admin', text: `${user.nickname} has left the room.`, icon: 0});
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})  // someone left, update the room data
        });
        }
    });

    socket.on('disconnecting', (reason) => {
        console.log(reason)
    });
});

/* connect to our Mongo database */
const uri = process.env.ATLAS_URI;
// these options are added to silient some deprecated features warning
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established sucessfully.");

    /* server starts to listen. */
    server.listen(PORT, () => {
        console.log(`Server has started on port ${PORT}`);
    });
});
