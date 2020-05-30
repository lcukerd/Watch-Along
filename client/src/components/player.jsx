import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ListGroup, Form, Navbar, Nav, FormControl, Button, Tooltip, OverlayTrigger, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';


class Player extends Component {
    socket = io();
    pullingSync = false;
    name = this.props.name;
    state = {
        id: this.props.roomId,
        url: 'https://www.youtube.com/watch?v=xwLcB1QEPm4',
        playing: false,
        played: 0,
        muted: true,
        editName: false,
        roomies: {},
        serverInactive: false,
        alerts: {}
    }

    handlePlay = () => {
        console.log('onPlay')
        if (this.state.playing === false) {
            this.setState({ playing: true, played: this.player.getCurrentTime() }, () => this.sync())
        }
    }

    handlePause = () => {
        console.log('onPause')
        if (this.state.playing === true) {
            this.setState({ playing: false, played: this.player.getCurrentTime() }, () => this.sync())
        }
    }

    handleProgress = progress => {
        this.setState({ played: progress.playedSeconds });
    }

    sync() {
        console.log(`Syncing ${this.state.played}`)
        this.socket.emit('sync', this.state);
    }

    ref = player => {
        this.player = player
    }

    componentDidUpdate = (prevProps, prevState) => {
        // Don't send data to server that is coming from server at the first place
        if (this.pullingSync) {
            this.pullingSync = false;
        } else if (prevState.url && this.state.url !== prevState.url) {
            console.log(`Syncing URL ${this.state.url}`)
            this.socket.emit('loadURL', { id: this.state.id, url: this.state.url });
        }
    }

    playerReady = () => {
        this.socket.on('sync', msg => {
            this.pullingSync = true;
            msg.played = msg.played + ((((new Date()).getTime()) - msg.ts) / 1000)
            console.log(`Pulling sync ${msg.played} and ${msg.playing}`)
            if (msg.url) {
                this.urlInput.value = this.state.url;
            }
            if (Math.abs(this.state.played - msg.played) > 2) {
                this.player.seekTo(parseFloat(msg.played))
            }
            this.setState(msg)
        });
        this.socket.on('syncRoomies', msg => {
            console.log('Roomies updated');
            this.setState({ roomies: msg });
        })
        this.socket.emit('register', { id: this.state.id });
        this.socket.on('connect_error', err => this.handleErrors());
        this.socket.on('connect_failed', err => this.handleErrors());
        this.socket.on('disconnect', err => this.handleErrors());
        this.handleNameUpdate();
    }

    handleErrors = () => {
        let alert = this.state.alerts;
        alert['sInactive'] = 'Server went inactive. Please refresh page.';
        this.setState({ alerts: alert });
    }

    handleOnSubmit = (event, fn) => {
        event.preventDefault();
        event.stopPropagation();
        fn();
    }

    showLoginInfo = () => {
        if (this.state.editName) {
            return (
                <Form inline onSubmit={event => this.handleOnSubmit(event, () => { this.name = this.userName.value; this.handleNameUpdate(); this.setState({ editName: !this.state.editName }) })}>
                    <FormControl type="text" placeholder="Enter Name" className="mr-sm-2" ref={input => { this.userName = input }} defaultValue={this.name} />
                </Form>
            )
        }
        else {
            return `Logged in as: ${this.name}`
        }
    }

    handleNameUpdate = () => this.socket.emit('syncRoomies', { id: this.state.id, name: this.name });

    handleLoadClick = () => {
        if (!ReactPlayer.canPlay(this.urlInput.value)) {
            let alert = this.state.alerts;
            alert['cantPlay'] = 'Might not be able to play video from given URL.';
            this.setState({ alerts: alert });
        }
        this.setState({ url: this.urlInput.value, playing: false, played: 0 })
    };

    showAlert = () => {
        return Object.keys(this.state.alerts).map(key => {
            const value = this.state.alerts[key];
            return (
                < Alert variant='danger' id={key} onClose={() => {
                    let alert = this.state.alerts;
                    delete alert[key];
                    this.setState({ alerts: alert })
                }} dismissible>
                    {value}
                </Alert >
            )
        })
    };

    render() {
        return (
            <div>
                {this.showAlert()}
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand onClick={() => window.open(window.location.href.replace(`?id=${this.state.id}`, ''), '_self')}>
                        <img
                            alt=""
                            src="/favicon.ico"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{'  '}
                        Watch Along
                        </Navbar.Brand>
                    <Nav className="mr-auto">
                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={props => <Tooltip id="button-tooltip" {...props}>Share this Room's # or the wepage's URL with friends to invite them over</Tooltip>}>
                            <Navbar.Text>
                                {`Room #${this.state.id}`}
                            </Navbar.Text>
                        </OverlayTrigger>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Form inline style={{ marginRight: '10px', width: '35rem' }} onSubmit={event => this.handleOnSubmit(event, this.handleLoadClick)}>
                            <FormControl style={{ width: '30rem' }} type="text" placeholder="Enter Url" className="mr-sm-2" ref={input => { this.urlInput = input }} defaultValue={this.state.url} />
                            <Button variant="outline-light" onClick={this.handleLoadClick}>Load</Button>
                        </Form>
                        <OverlayTrigger placement="bottom" overlay={props => <Tooltip id="button-tooltip" {...props}>Click to edit name</Tooltip>}>
                            <Navbar.Text onClick={() => { if (!this.state.editName) this.setState({ editName: !this.state.editName }) }}>
                                {this.showLoginInfo()}
                            </Navbar.Text>
                        </OverlayTrigger>
                    </Navbar.Collapse>
                </Navbar>
                <div className='player-wrapper'
                    style={{ margin: '10px' }}>
                    <ReactPlayer
                        className='react-player'
                        ref={this.ref}
                        width='70%'
                        height='70%'
                        playing={this.state.playing}
                        // Chrome does not allow autoplaying video unless muted
                        muted={this.state.muted}
                        onReady={this.playerReady}
                        onProgress={this.handleProgress}
                        onPlay={this.handlePlay}
                        onPause={this.handlePause}
                        controls={true}
                        url={this.state.url} />
                    <ListGroup className='list-group1'>
                        <ListGroup.Item><h5>Room Members</h5></ListGroup.Item>
                        {Object.keys(this.state.roomies).map(key => <ListGroup.Item key={key}>{this.state.roomies[key]}</ListGroup.Item>)}
                    </ListGroup>
                </div>
            </div >
        );
    }
}

export default Player;