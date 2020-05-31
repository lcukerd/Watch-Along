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


class Room extends Component {
    socket = io();
    state = {
        memberName: '',
        playing: false,
        played: 0,
        currUrl: 'https://www.youtube.com/watch?v=xwLcB1QEPm4',
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

    componentDidMount = () => {
        this.socket.emit('register', { id: this.props.roomId });

        this.socket.on('sync', msg => {
            msg.played = msg.played + ((((new Date()).getTime()) - msg.ts) / 1000)
            if (Math.abs(this.state.played - msg.played) > 2) this.player.seekTo(parseFloat(msg.played));
            this.setState(msg);
        });

        this.socket.on('connect_error', err => this.handleErrors());
        this.socket.on('connect_failed', err => this.handleErrors());
        this.socket.on('disconnect', err => this.handleErrors());
    }

    render() {
        return (
            <div>
                <div className={this.state.memberName ? '' : 'bg-image'}>
                    {this.showAlert()}
                    <NavigationBar roomId={this.props.roomId} currUrl={this.state.currUrl} memberName={this.state.memberName} enterRoom={this.enterRoom} handleLoadClick={this.handleLoadClick} />
                    <div className='row' style={{ margin: '5px' }}>
                        <div className='player-wrapper col'>
                            <Player roomId={this.props.roomId} playing={this.state.playing} played={this.state.played} currUrl={this.state.currUrl} getreference={this.ref} sync={this.sync} handleProgress={this.handleProgress} />
                        </div>
                        <MemberList className='col' socket={this.socket} />
                    </div>
                    <div style={{ margin: '5px' }}>
                        <Queue />
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

    handleLoadClick = url => {
        if (!ReactPlayer.canPlay(url)) {
            let alert = this.state.alerts;
            alert['cantPlay'] = 'Might not be able to play video from given URL.';
            this.setState({ alerts: alert });
        }
        this.setState({ currUrl: url, playing: false, played: 0 })
        this.socket.emit('loadURL', { currUrl: url });
    };

    ref = player => this.player = player;

    handleProgress = progress => {
        this.setState({ played: progress.playedSeconds });
    }

    sync = status => this.setState(status, () => this.socket.emit('sync', status));

}

export default Room;