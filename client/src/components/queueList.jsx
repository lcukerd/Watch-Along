import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import ReactPlayer from 'react-player';

class Queue extends Component {

    showQueue = () => {
        return this.props.queueUrl.map((item, index) => {
            return (
                <ListGroup.Item style={{ padding: '2px' }}>
                    <div className='player-wrapper-small' onClick={() => this.props.playMediafromQueue(index)} onDoubleClick={() => this.props.handleRemovedfromQueue(index)}>
                        <ReactPlayer style={{ position: 'absolute', top: 0, left: 0, 'pointer-events': 'none' }} width='100%' height='100%' url={item} />
                    </div>
                </ListGroup.Item >
            )
        });
    };

    render() {
        return (
            <ListGroup className='list-group-queue' horizontal>
                {this.showQueue()}
            </ListGroup>
        );
    }
}

export default Queue;