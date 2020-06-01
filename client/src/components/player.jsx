import React, { Component } from 'react';
import ReactPlayer from 'react-player';

class Player extends Component {
    handlePlay = () => {
        console.log(`onPlay`)
        if (this.props.playing === false) {
            this.props.sync({ playing: true, played: this.player.getCurrentTime(), playlistIndex: this.player.getInternalPlayer().getPlaylistIndex() })
        }
    }

    handlePause = () => {
        console.log('onPause')
        if (this.props.playing === true) {
            this.props.sync({ playing: false, played: this.player.getCurrentTime(), playlistIndex: this.player.getInternalPlayer().getPlaylistIndex() })
        }
    }

    render() {
        return (
            <ReactPlayer
                className='react-player'
                ref={player => { this.player = player; this.props.getreference(player); }}
                width='100%'
                height='100%'
                playing={this.props.playing}
                muted={true}
                onProgress={this.props.handleProgress}
                onPlay={this.handlePlay}
                onPause={this.handlePause}
                onEnded={this.props.handleVideoEnded}
                onReady={this.props.playerReady}
                controls={true}
                url={this.props.currUrl} />
        );
    }

}

export default Player;