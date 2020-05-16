const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

server.listen(1997);
let connectedRooms = {};

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => { res.sendfile(path.join(__dirname = '../client/build/index.html')); })
} else {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/public/index.html'));
    });
}

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
        // Don't sync url here
        delete connectedRooms[id].url;
        socket.to(`Room #${id}`).emit('sync', connectedRooms[id]);
    });

    // Passively sync video url
    socket.on('loadURL', msg => {
        const id = msg.id;
        connectedRooms[id].url = msg.url;
        connectedRooms[id].playing = false;
        connectedRooms[id].played = 0;
        socket.to(`Room #${id}`).emit('sync', connectedRooms[id]);
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected with ${socket.id}`);
    })
})