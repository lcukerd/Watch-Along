const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var favicon = require('serve-favicon');
const path = require('path');
const port = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, '../client/build')));
app.use(favicon(path.join(__dirname, "../favicon.ico")));
let fileLoc = '';
server.listen(port);
let connectedRooms = {};
let mapSocket = {};
console.log(`Using port ${port}`)

if (process.env.NODE_ENV === 'production') fileLoc = path.join(__dirname = '../client/build/index.html');
else fileLoc = path.join(__dirname, '../client/public/index.html');

app.get('/', (req, res) => {
    res.sendFile(fileLoc);
});

app.get('/stayUp', (req, res) => {
    console.log('Kept Active by user')
    res.send('I am Up!');
});

io.on('connection', socket => {
    console.log('Got a new connection');

    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('register', msg => {
        const id = msg.id;
        console.log(`Registering room #${id} for ${socket.id}`);
        socket.join(`Room #${id}`);
        mapSocket[socket.id] = id;

        if (!(id in connectedRooms)) {
            connectedRooms[id] = {};
            connectedRooms[id].roomies = {};
        }
        connectedRooms[id].roomies[socket.id] = socket.id;
        socket.emit('sync', connectedRooms[id]);
        io.in(`Room #${id}`).emit('syncRoomies', connectedRooms[id].roomies);
        console.log('Registered')
    });

    // Actively sync player status
    socket.on('sync', msg => {
        const id = mapSocket[socket.id]
        try {
            for (const key in msg) {
                connectedRooms[id][key] = msg[key];
            }
        } catch (err) {
            console.log(err);
        }
        connectedRooms[id].ts = (new Date()).getTime();
        socket.to(`Room #${id}`).emit('sync', Object.assign(connectedRooms[id]), { currUrl: undefined });
    });

    // Passively sync video url
    socket.on('loadURL', msg => {
        try {
            const id = mapSocket[socket.id]
            connectedRooms[id].currUrl = msg.currUrl;
            if (msg.playing) connectedRooms[id].playing = msg.playing;
            else connectedRooms[id].playing = false;
            connectedRooms[id].played = 0;
            connectedRooms[id].playlistIndex = -1;
            connectedRooms[id].ts = (new Date()).getTime();
            socket.to(`Room #${id}`).emit('sync', connectedRooms[id]);
        }
        catch (err) {
            console.log(`Server went inactive`)
        }
    })

    socket.on('syncRoomies', msg => {
        try {
            const id = mapSocket[socket.id]
            if (!connectedRooms[id].roomies) connectedRooms[id].roomies = {};
            let roomies = connectedRooms[id].roomies;
            roomies[socket.id] = msg.name;
            io.in(`Room #${id}`).emit('syncRoomies', connectedRooms[id].roomies);
        }
        catch (err) {
            console.log(`Server went inactive`)
        }
    })

    socket.on('syncQueue', msg => {
        try {
            console.log(msg.queue.length)
            const id = mapSocket[socket.id]
            connectedRooms[id].queue = msg.queue;
            io.in(`Room #${id}`).emit('syncQueue', connectedRooms[id]);
        }
        catch (err) {
            console.log(`Server went inactive`)
        }
    })

    socket.on('pingCheck', msg => {
        try {
            console.log('Performing Ping Check for all Roomies');
            const id = mapSocket[socket.id]
            delete connectedRooms[id].roomies;
            io.in(`Room #${id}`).emit('pingCheck');
        }
        catch (err) {
            console.log(`Server went inactive`)
        }
    })

    socket.on('disconnect', () => {
        try {
            const id = mapSocket[socket.id];
            let roomies = connectedRooms[id].roomies;
            delete roomies[socket.id];
            io.in(`Room #${id}`).emit('syncRoomies', connectedRooms[id].roomies);
        }
        catch (err) {
            console.log(`Socket ${socket.id} not found`)
        }
        console.log(`Disconnected with ${socket.id}`);
    })
})