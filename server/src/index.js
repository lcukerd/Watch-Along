const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(1997);

app.get('/', (req, res) => {
    res.send('Hello');
});

io.on('connection', socket => {
    console.log('Testing Socket');
    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('private', (from, msg) => {
        console.log(`Got a Secret message on Server from ${from} that ${msg}`);
    })

    socket.emit('private', { msg: 'Secret' });

    socket.on('disconnect', () => {
        io.emit(`Disconnected with ${socket.id}`);
    })
})