import React, { Component } from 'react';
import ReactPlayer from 'react-player'

class Player extends Component {
    componentDidMount() {
        this.getList();
    }

    // Retrieves the list of items from the Express app
    getList = () => {
        fetch('/').then(res => console.log(res));
    }

    render() {
        return <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' playing />;
    }
}

export default Player;