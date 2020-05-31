import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import store from './../store'
import * as actions from './../actions'

class Player extends Component {
    pullingSync = false;
    state = {
        id: this.props.roomId,
        currUrl: '',
        playing: false,
        played: 0,
        muted: true,
    }

    handlePlay = () => {
        console.log(`onPlay`)
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
        store.getState().socket.emit('sync', this.state);
    }

    ref = player => {
        this.player = player
    }

    componentDidMount = () => {
        store.subscribe(() => {
            const sState = store.getState();
            console.log(`UPdating ${sState.playing}`);
            if (Math.abs(this.state.played - sState.played) > 2) this.player.seekTo(parseFloat(sState.played));
            this.setState({ currUrl: sState.currUrl, playing: sState.playing });
        });
    }

    render() {
        return (
            <ReactPlayer
                className='react-player'
                ref={this.ref}
                width='70%'
                height='70%'
                playing={this.state.playing}
                muted={this.state.muted}
                onProgress={this.handleProgress}
                onPlay={this.handlePlay}
                onPause={this.handlePause}
                controls={true}
                url={this.state.currUrl} />
        );
    }

}

export default Player;