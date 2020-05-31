import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import store from './../store'

class Members extends Component {
    state = {
        roomies: {}
    }

    componentDidMount = () => {
        // store.getState().socket.on('syncRoomies', msg => {
        //     console.log('Roomies updated');
        //     this.setState({ roomies: msg });
        // })
    }

    render() {
        return (
            <ListGroup className='list-group1'>
                <ListGroup.Item><h5>Room Members</h5></ListGroup.Item>
                {Object.keys(this.state.roomies).map(key => <ListGroup.Item key={key}>{this.state.roomies[key]}</ListGroup.Item>)}
            </ListGroup>
        );
    }
}

export default Members;