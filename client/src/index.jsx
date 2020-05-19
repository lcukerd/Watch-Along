import React from 'react';
import ReactDOM from 'react-dom';
import Room from './components/room'
import RoomieName from './components/roomieName';

const roomId = window.location.search.replace("?id=", '');
console.log(roomId);

if (roomId) ReactDOM.render(<RoomieName roomId={roomId} />, document.getElementById('root'));
else ReactDOM.render(<Room />, document.getElementById('root'));