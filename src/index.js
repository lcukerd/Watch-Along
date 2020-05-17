const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '../client/build')));
let fileLoc = '';
server.listen(port);
let connectedRooms = {};

if (process.env.NODE_ENV === 'production') fileLoc = path.join(__dirname = '../client/build/index.html');
else fileLoc = path.join(__dirname, '../client/public/index.html');

app.get('*', (req, res) => {
    res.sendFile(fileLoc);
});

io.on('connection', socket => {
    console.log('Got a new connection');

    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('register', msg => {
        const id = msg.id;
        console.log(`Registering room #${id} for ${socket.id}`);
        socket.join(`Room #${id}`);

        if (!(id in connectedRooms)) {
            connectedRooms[id] = {};
        }
        socket.emit('sync', connectedRooms[id]);
        console.log('Registered')
    });

    // Actively sync player status
    socket.on('sync', msg => {
        const id = msg.id;
        delete msg.id;
        for (const key in msg) {
            connectedRooms[id][key] = msg[key];
        }
        connectedRooms[id].ts = (new Date()).getTime();
        socket.to(`Room #${id}`).emit('sync', Object.assign({ url: undefined }, connectedRooms[id]));
    });

    // Passively sync video url
    socket.on('loadURL', msg => {
        const id = msg.id;
        connectedRooms[id].url = msg.url;
        connectedRooms[id].playing = false;
        connectedRooms[id].played = 0;
        connectedRooms[id].ts = (new Date()).getTime();
        socket.to(`Room #${id}`).emit('sync', connectedRooms[id]);
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected with ${socket.id}`);
    })
})