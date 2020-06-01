import React, { Component } from 'react';
import { ListGroup, Card } from 'react-bootstrap';


class Queue extends Component {
    render() {
        return (
            <ListGroup className='list-group-queue' horizontal>
                <ListGroup.Item>
                    <Card style={{ width: '18rem', heigh: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                        </Card.Body>
                    </Card>
                </ListGroup.Item>
            </ListGroup>
        );
    }
}

export default Queue;