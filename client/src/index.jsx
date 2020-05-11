import React from 'react';
import ReactDOM from 'react-dom';
import Player from './components/player'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:1997');
socket.emit('register', { id: 23 });
ReactDOM.render(<Player />, document.getElementById('root'));