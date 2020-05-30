import React, { Component } from 'react';
import { Card, Button, Navbar } from 'react-bootstrap';
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
                <div>
                    <Navbar bg="primary" variant="dark">
                        <Navbar.Brand>
                            <img
                                alt=""
                                src="/favicon.ico"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{'  '}
                        Watch Along
                        </Navbar.Brand>
                    </Navbar>
                    <Card style={{ width: '18rem', margin: '10px', backgroundColor: '#f06292' }}>
                        <Card.Body>
                            <Card.Title>Enter name</Card.Title>
                            <Card.Text>Enter your name below so that your friends can see who joined</Card.Text>
                            <input placeholder='Name' type='text' ref={input => { this.name = input }} onKeyUp={event => this.handleKeyUp(event, () => this.enterRoom(this.name.value))} />
                            <Button onClick={() => this.enterRoom(this.name.value)} style={{ backgroundColor: '#ba2d65', 'border-color': '#ba2d65', marginTop: '17px' }}>Let's go</Button>
                        </Card.Body>
                    </Card>
                </div >
            )
    }

    render() {
        return this.handleComponent();
    }

}

export default RoomieName;