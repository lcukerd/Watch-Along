const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 5000;

//  Todo:
//  Error handling and ask user to refresh in case of issue.

app.use(express.static(path.join(__dirname, '../client/build')));
let fileLoc = '';
server.listen(port);
let connectedRooms = {};
console.log(`Using port ${port}`)

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
            connectedRooms[id].roomies = {};
        }
        connectedRooms[id].roomies[socket.id] = socket.id;
        socket.emit('sync', connectedRooms[id]);
        io.in(`Room #${id}`).emit('syncRoomies', connectedRooms[id].roomies);
        console.log('Registered')
    });

    // Actively sync player status
    socket.on('sync', msg => {
        const id = msg.id;
        delete msg.id;
        try {
            for (const key in msg) {
                connectedRooms[id][key] = msg[key];
            }
        } catch (err) {
            console.log(err);
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

    socket.on('syncRoomies', msg => {
        const id = msg.id;
        let roomies = connectedRooms[id].roomies;
        roomies[socket.id] = msg.name;
        io.in(`Room #${id}`).emit('syncRoomies', connectedRooms[id].roomies);
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected with ${socket.id}`);
    })
})