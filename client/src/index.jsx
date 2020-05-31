import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main'
import Room from './components/room';

const roomId = window.location.search.replace("?id=", '');
console.log(roomId);

if (roomId) ReactDOM.render(<Room roomId={roomId} />, document.getElementById('root'));
else ReactDOM.render(<Main />, document.getElementById('root'));