import React, { Component } from 'react';
import { Card, Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Room extends Component {
    roomId = '';

    enterRoom = id => {
        window.open(`${window.location.href}?id=${id}`, '_self');
    }

    handleKeyUp = (event, fn) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            fn();
        }
    }

    render() {
        return (
            <div>
                <Navbar bg="primary" variant="dark">
                    <Container >
                        <Navbar.Brand style={{ marginLeft: '20px' }}>
                            <img
                                alt=""
                                src="/favicon.ico"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{'  '}
                        Watch Along
                        </Navbar.Brand>
                    </Container>
                </Navbar>
                <Container className="align-items-center">
                    <Row style={{ margin: '10px' }}>
                        <h2>
                            Overview
                        </h2>
                        <p>
                            Watch Along is a synchronized video viewing platform. A platform where users can create a room and watch videos with their friends in sync.
                        </p>
                        <p>
                            Every member of the room can control the video and the platform ensures that everyone is watching the same part of the video at the same time. It's just as if you were watching together on a laptop.
                        </p>
                        <h3>
                            How to use:
                        </h3>
                        <p>
                            Create a room with some room id. Once you enter the room, share that room ID (or the full URL) with your friends.
                            <br />
                            The player supports following video types: YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, DailyMotion, and MP4 video URLs.
                        </p>
                    </Row>
                    <Row style={{
                        position: 'absolute',
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
                                    <input placeholder='Room #' type='text' ref={input => { this.roomId = input }} onKeyUp={event => this.handleKeyUp(event, () => this.enterRoom(this.roomId.value))} />
                                    <Button onClick={() => this.enterRoom(this.roomId.value)} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65', marginTop: '17px' }}>Let's go</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Room;