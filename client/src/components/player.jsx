import React, { Component } from 'react';

class Player extends Component {
    componentDidMount() {
        this.getList();
    }

    // Retrieves the list of items from the Express app
    getList = () => {
        fetch('/').then(res => console.log(res));
    }

    render() {
        return <h1>Hello World</h1>
    }
}

export default Player;