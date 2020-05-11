import React from 'react';
import ReactDOM from 'react-dom';
import Player from './components/player'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:1997');
socket.on('private', data => {
  console.log(`Got a Secret message ${data}`);
})
ReactDOM.render(<Player />, document.getElementById('root'));