import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import openSocket from 'socket.io-client';

class Player extends Component {
    socket = openSocket('http://localhost:1997');
    pullingSync = false;
    state = {
        id: 23,
        url: 'https://www.youtube.com/watch?v=vNXuvGK8Wzc',
        playing: false,
        played: 0,
        muted: true
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

    componentDidUpdate(prevProps, prevState) {
        // Don't send data to server that is coming from server at the first place
        if (this.pullingSync) {
            this.pullingSync = false;
            return
        }
        if (prevState.url && this.state.url !== prevState.url) {
            console.log(`Syncing URL ${this.state.url}`)
            this.socket.emit('loadURL', { id: this.state.id, url: this.state.url });
        }
        else {
            this.sync();
        }
    }

    playerReady = () => {
        this.socket.on('sync', msg => {
            this.pullingSync = true;
            console.log(`Pulling sync ${msg.played} and ${msg.playing}`)
            if (Math.abs(this.state.played - msg.played) > 2) {
                this.player.seekTo(parseFloat(msg.played))
            }
            if (msg.url) {
                this.urlInput.value = this.state.url;
            }
            this.setState(msg)
        });
        this.socket.emit('register', { id: 23 });
    }

    render() {
        return (
            <div>
                <div className='controls'>
                    <input ref={input => { this.urlInput = input }} type='text' defaultValue={this.state.url} size='100' />
                    <button onClick={() => this.setState({ url: this.urlInput.value, playing: false, played: 0 })}>Load</button>
                </div>
                <div className='player-wrapper'>
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
            </div>
        );
    }
}

export default Player;