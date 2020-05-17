import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';

// Todo:
// * New joiners with changed URL not in sync

class Player extends Component {
    socket = io();
    pullingSync = false;
    state = {
        id: this.props.roomId,
        url: 'https://www.youtube.com/watch?v=vNXuvGK8Wzc',
        playing: false,
        played: 0,
        muted: true,
        roomies: {}
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
    }

    handleKeyUp = (event, fn) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            fn();
        }
    }

    handleNameUpdate = () => this.socket.emit('syncRoomies', { id: this.state.id, name: this.userName.value });

    handleLoadClick = () => this.setState({ url: this.urlInput.value, playing: false, played: 0 })

    render() {
        return (
            <div>
                <h1 style={{ margin: '10px', 'textAlign': 'center' }}>Watch Along</h1>
                <h5 style={{ 'textAlign': 'center' }}>{`Room #${this.state.id}`}</h5>
                <h6 style={{ marginBottom: '20px', 'textAlign': 'center' }}>Share this Room's # or the wepage's URL with friends to invite them over.</h6>
                <div className='controls'>
                    <input ref={input => { this.userName = input }} onKeyUp={event => this.handleKeyUp(event, this.handleNameUpdate)} style={{ marginBottom: '10px' }} type='text' placeholder='Enter your name' size='20' />
                    <br />
                    <input ref={input => { this.urlInput = input }} onKeyUp={event => this.handleKeyUp(event, this.handleLoadClick)} type='text' defaultValue={this.state.url} size='100' />
                    <button onClick={this.handleLoadClick}>Load</button>
                </div>
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
                </div>
                <h5>Room Members</h5>
                <ListGroup className='list-group'>
                    {Object.keys(this.state.roomies).map(key => <ListGroup.Item key={key}>{this.state.roomies[key]}</ListGroup.Item>)}
                </ListGroup>
            </div >
        );
    }
}

export default Player;