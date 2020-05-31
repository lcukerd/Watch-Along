import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class MemberName extends Component {
    handleKeyUp = (event, fn) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            fn();
        }
    }

    render() {
        return (
            <Card style={{ position: 'absolute', top: '50%', left: '50%', width: '18rem', transform: 'translate(-50%, -50%)', margin: '10px', backgroundColor: '#f06292' }}>
                <Card.Body>
                    <Card.Title>Enter name</Card.Title>
                    <Card.Text>Enter your name below so that your friends can see who joined</Card.Text>
                    <input placeholder='Name' type='text' ref={input => { this.name = input }} onKeyUp={event => this.handleKeyUp(event, () => this.props.enterRoom(this.name.value))} />
                    <Button onClick={() => this.enterRoom(this.name.value)} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65', marginTop: '17px' }}>Let's go</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default MemberName;