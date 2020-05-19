import React, { Component } from 'react';
import { Card, Button, Container, Row } from 'react-bootstrap';
import Player from './player'
import 'bootstrap/dist/css/bootstrap.min.css';

class RoomieName extends Component {

    state = {
        name: ''
    }

    handleKeyUp = (event, fn) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            fn();
        }
    }

    enterRoom = name => {
        this.setState({ name: name });
    }

    handleComponent = () => {
        if (this.state.name)
            return <Player roomId={this.props.roomId} name={this.state.name} />
        else
            return (
                <Container className="align-items-center">
                    <Row style={{
                        position: 'absolute',
                        top: 0, bottom: 0,
                        alignItems: 'center'
                    }}>
                        <Card style={{ width: '18rem', margin: '4px', backgroundColor: '#f06292' }}>
                            <Card.Body>
                                <Card.Title>Enter name</Card.Title>
                                <Card.Text>Enter your name below so that your friends can see who joined</Card.Text>
                                <input placeholder='Name' type='text' ref={input => { this.name = input }} onKeyUp={event => this.handleKeyUp(event, () => this.enterRoom(this.name.value))} />
                                <Button onClick={() => this.enterRoom(this.name.value)} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65', marginTop: '17px' }}>Let's go</Button>
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
            )
    }

    render() {
        return this.handleComponent();
    }

}

export default RoomieName;