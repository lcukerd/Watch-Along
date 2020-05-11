import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Player from './components/player'
import * as serviceWorker from './serviceWorker';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:1997');
socket.on('private', data => {
  console.log(`Got a Secret message ${data}`);
})
ReactDOM.render(<Player />, document.getElementById('root'));
serviceWorker.unregister();