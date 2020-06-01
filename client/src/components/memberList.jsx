import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';

class MemberList extends Component {
    state = {
        roomies: {}
    }

    componentDidMount = () => {
        this.props.socket.on('syncRoomies', msg => {
            console.log('Roomies updated');
            this.setState({ roomies: msg });
        })
    }

    render() {
        return (
            <ListGroup className='list-group1'>
                <ListGroup.Item onClick={() => this.props.socket.emit('pingCheck')}><h5>Room Members</h5></ListGroup.Item>
                {Object.keys(this.state.roomies).map(key => <ListGroup.Item key={key}>{this.state.roomies[key]}</ListGroup.Item>)}
            </ListGroup>
        );
    }
}

export default MemberList;