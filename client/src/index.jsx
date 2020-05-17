import React from 'react';
import ReactDOM from 'react-dom';
import Player from './components/player'
import Room from './components/room'

const roomId = window.location.search.replace("?id=", '');
console.log(roomId);

if (roomId) ReactDOM.render(<Player roomId={roomId} />, document.getElementById('root'));
else ReactDOM.render(<Room />, document.getElementById('root'));