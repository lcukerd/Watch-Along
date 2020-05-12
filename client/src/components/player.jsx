import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import openSocket from 'socket.io-client';

// Todo:
// * Sync when url is changed
// * Correctly sync new roomies 

class Player extends Component {
    socket = openSocket('http://localhost:1997');
    state = {
        id: 23,
        url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
        playing: false,
        played: 0
    }

    load = url => {
        this.setState({
            url,
            played: 0
        })
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

    componentDidUpdate(prev) {
        if (Math.abs(this.state.played - prev.played) > 2) {
            this.sync();
        }
    }

    constructor() {
        super();
        this.socket.emit('register', { id: 23 });
        this.socket.on('sync', msg => {
            console.log(`Pulling sync ${msg.played}`)
            this.setState(msg)
            this.player.seekTo(parseFloat(msg.played))
        });
    }

    render() {
        return (
            <div>
                <div className='controls'>
                    <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' size='100' />
                    <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
                </div>
                <div className='player-wrapper'>
                    <ReactPlayer
                        className='react-player'
                        ref={this.ref}
                        width='70%'
                        height='70%'
                        playing={this.state.playing}
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