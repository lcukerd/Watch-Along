import React, { Component } from 'react';
import ReactPlayer from 'react-player';

class Player extends Component {
    handlePlay = () => {
        console.log(`onPlay`)
        if (this.props.playing === false) {
            this.props.sync({ playing: true, played: this.player.getCurrentTime() })
        }
    }

    handlePause = () => {
        console.log('onPause')
        if (this.props.playing === true) {
            this.props.sync({ playing: false, played: this.player.getCurrentTime() })
        }
    }

    render() {
        return (
            <ReactPlayer
                className='react-player'
                ref={player => { this.player = player; this.props.getreference(player); }}
                width='70%'
                height='70%'
                playing={this.props.playing}
                muted={true}
                onProgress={this.props.handleProgress}
                onPlay={this.handlePlay}
                onPause={this.handlePause}
                controls={true}
                url={this.props.currUrl} />
        );
    }

}

export default Player;