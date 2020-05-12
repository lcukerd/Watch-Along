const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(1997);
let connectedRooms = {};

app.get('/', (req, res) => {
    res.send('Hello');
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
        console.log('Registered')
    });

    socket.on('sync', msg => {
        const id = msg.id;
        delete msg.id;
        for (const key in msg) {
            connectedRooms[id][key] = msg[key];
        }
        socket.to(`Room #${id}`).emit('sync', connectedRooms[id]);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected with ${socket.id}`);
    })
})