import React, { Component } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Room extends Component {
    roomId = '';

    enterRoom = id => {
        window.open(`${window.location.href}room?id=${id}`, '_self');
    }

    handleKeyUp = (event, fn) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            fn();
        }
    }

    render() {
        return (
            <Container className="align-items-center" style={{
                position: 'absolute',
                top: 0, left: 0,
                right: 0, bottom: 0
            }}>
                <Row style={{
                    position: 'absolute',
                    top: 0, bottom: 0,
                    alignItems: 'center'
                }}>
                    <Col>
                        <Card style={{ width: '18rem', margin: '4px', backgroundColor: '#f06292' }}>
                            <Card.Body>
                                <Card.Title>Create Room</Card.Title>
                                <Card.Text>Click below if you do not have a room number and would like to create a new room.</Card.Text>
                                <Button onClick={() => this.enterRoom(parseInt((new Date()).getTime() / 1000))} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65' }}>Let's go</Button >
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '18rem', margin: '4px', backgroundColor: '#f06292' }}>
                            <Card.Body>
                                <Card.Title>Join Room</Card.Title>
                                <Card.Text>Enter your Room number below</Card.Text>
                                <input placeholder='Room #' type='number' ref={input => { this.roomId = input }} onKeyUp={event => this.handleKeyUp(event, () => this.enterRoom(this.roomId.value))} />
                                <Button onClick={() => this.enterRoom(this.roomId.value)} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65', marginTop: '17px' }}>Let's go</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Room;