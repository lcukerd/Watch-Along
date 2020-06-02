import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import ReactPlayer from 'react-player';
import NavigationBar from './navigationBar';
import Player from './player';
import MemberName from './memberName';
import Queue from './queueList';
import MemberList from './memberList';
import https from 'https';

class Room extends Component {
    socket = io();
    videoEnded = true;
    index = -1;
    state = {
        memberName: '',
        playing: false,
        played: 0,
        currUrl: 'https://www.youtube.com/watch?v=xwLcB1QEPm4',
        playlistIndex: -1,
        queue: [],
        alerts: {}
    }

    handleErrors = () => {
        let alert = this.state.alerts;
        alert['sInactive'] = 'Server went inactive. Please refresh page.';
        this.setState({ alerts: alert });
    }

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

    componentDidUpdate = () => {
        if (this.state.playing) this.videoEnded = false;
    }

    componentDidMount = () => {
        this.socket.emit('register', { id: this.props.roomId });

        this.socket.on('sync', msg => {
            msg.played = msg.played + ((((new Date()).getTime()) - msg.ts) / 1000)
            // New joinees will not point to correct video in playlist
            try {
                if (this.player.getInternalPlayer() && this.player.getInternalPlayer().getPlaylistIndex() !== msg.playlistIndex && msg.playlistIndex !== -1) this.player.getInternalPlayer().playVideoAt(msg.playlistIndex);
            } catch (err) {
                console.log(`Internal Player Error ${err.stack}`)
            }
            if (Math.abs(this.state.played - msg.played) > 2) this.player.seekTo(parseFloat(msg.played));
            if (msg.currUrl) {
                this.urlInput.value = msg.currUrl;
            }
            this.setState(msg);
        });

        this.socket.on('syncQueue', msg => this.setState({ queue: msg.queue }));

        this.socket.on('pingCheck', msg => this.socket.emit('syncRoomies', { name: this.state.memberName }));

        this.socket.on('connect_error', err => this.handleErrors());
        this.socket.on('connect_failed', err => this.handleErrors());
        this.socket.on('disconnect', err => this.handleErrors());
        setInterval(() => https.get(`stayUp`), 60 * 1000);

    }

    render() {
        return (
            <div>
                <div className={this.state.memberName ? '' : 'bg-image'}>
                    {this.showAlert()}
                    <NavigationBar roomId={this.props.roomId} currUrl={this.state.currUrl} memberName={this.state.memberName} enterRoom={this.enterRoom} handleLoadClick={this.handleLoadClick} refUrlInput={this.refUrlInput} />
                    <div className='row' style={{ margin: '5px' }}>
                        <div className='player-wrapper col'>
                            <Player roomId={this.props.roomId} playing={this.state.playing} played={this.state.played} currUrl={this.state.currUrl} handleVideoEnded={this.handleVideoEnded} playerReady={this.playerReady} getreference={this.refPlayer} sync={this.sync} handleProgress={this.handleProgress} />
                        </div>
                        <MemberList className='col' socket={this.socket} />
                    </div>
                    <div style={{ margin: '5px' }}>
                        <Queue queueUrl={this.state.queue} playMediafromQueue={this.playMediafromQueue} />
                    </div>
                </div >
                {this.state.memberName ? '' : <MemberName enterRoom={this.enterRoom} />}
            </div>
        );
    }

    enterRoom = name => {
        if (name && name.replace(/\s/g, '')) {
            this.socket.emit('syncRoomies', { name });
            this.setState({ memberName: name })
        }
    }

    handleVideoEnded = () => {
        console.log('Video Ended')
        console.log((this.player.getInternalPlayer()));
        if (!(this.player.getInternalPlayer().getPlaylist() && this.player.getInternalPlayer().getPlaylistIndex() < this.player.getInternalPlayer().getPlaylist().length - 1)) {
            this.videoEnded = true;
            if (this.state.queue.length > (this.index + 1)) this.playMediafromQueue(this.index + 1);
        }
    }

    handleLoadClick = url => {
        if (!ReactPlayer.canPlay(url)) {
            let alert = this.state.alerts;
            alert['cantPlay'] = 'Might not be able to play video from given URL.';
            this.setState({ alerts: alert });
        }
        if (!this.state.currUrl || this.videoEnded) {
            this.index = this.state.queue.length;
            this.setState({ currUrl: url, playing: false, played: 0 })
            this.socket.emit('loadURL', { currUrl: url });
        }
        let q = this.state.queue;
        if (!q.includes(url)) {
            q.push(url);
            this.socket.emit('syncQueue', { queue: q });
        }
    };

    refPlayer = player => this.player = player;
    refUrlInput = urlInput => this.urlInput = urlInput;

    handleProgress = progress => {
        this.setState({ played: progress.playedSeconds });
    }

    playMediafromQueue = index => {
        console.log('Play from Queue');
        this.index = index;
        console.log(this.state.queue);
        console.log(index);
        this.socket.emit('loadURL', { currUrl: this.state.queue[index], playing: true });
        this.setState({ currUrl: this.state.queue[index], playing: true, played: 0 })
    }

    sync = status => {
        console.log(status.playing);
        this.setState(status, () => this.socket.emit('sync', status))
    };
}

export default Room;