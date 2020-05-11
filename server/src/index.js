const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let rooms = [];

server.listen(1997);

app.get('/', (req, res) => {
    res.send('Hello');
});

io.on('connection', socket => {
    console.log('Got a new connection');

    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('register', msg => {
        console.log(`Registering room #${msg.id} for ${socket.id}`);

        if (msg.id in rooms) {
            if (socket.id in rooms[msg.id].slaves) {
                rooms[msg.id].slaves.push(socket);
            }
        } else {
            rooms[msg.id] = {};
            rooms[msg.id].slaves = [];
        }
    });

    socket.on('sync', msg => {
        const id = msg.id;
        delete msg.id;
        for (const key in msg) {
            rooms[id].key = msg.key;
        }
        rooms.slaves.forEach(slave => slave.emit('sync', rooms[id]));
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected with ${socket.id}`);
    })
})