import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';
import NavigationBar from './navigationBar';
import Player from './player';
import MemberName from './memberName';
import Queue from './queueList';
import Members from './memberList';
import store from './../store'
import * as actions from './../actions'


class Room extends Component {
    socket = io();
    state = {
        memberName: '',
        alerts: {}
    }

    handleErrors = () => {
        let alerts = store.getState().alerts;
        alerts['sInactive'] = 'Server went inactive. Please refresh page.';
        store.dispatch({ type: actions.UPDATE_ALERT, payload: { alerts } })
    }

    // Check whether alerts are dismissing or not
    showAlert = () => {
        const alerts = this.state.alerts;
        store.dispatch({ type: actions.UPDATE_ALERT, payload: { alerts: undefined } })
        return Object.keys(alerts).map(key => {
            const value = alerts[key];
            return (
                < Alert variant='danger' dismissible>
                    {value}
                </Alert >
            )
        })
    };

    componentDidMount = () => {
        store.dispatch({ type: actions.ADD_SOCKET, payload: { roomId: this.props.roomId, socket: this.socket } });
        store.dispatch({ type: actions.UPDATE_CURR_URL, payload: { currUrl: 'https://www.youtube.com/watch?v=xwLcB1QEPm4', playing: false, played: 0 } })
        store.subscribe(() => {
            const sState = store.getState();
            if (this.state.memberName !== sState.name) this.setState({ memberName: sState.name });
            if (sState.alerts) this.state.showAlert = sState.alerts;
        });

        this.socket.on('sync', msg => {
            let payload = {};
            let action = actions.UPDATE_PLAYER_STATUS;
            payload.played = msg.played + ((((new Date()).getTime()) - msg.ts) / 1000)
            payload.playing = msg.playing;
            if (msg.currUrl) {
                payload.currUrl = msg.currUrl;
                action = actions.UPDATE_CURR_URL;
            }
            store.dispatch({ type: action, payload });
            console.log(`Pulling sync ${payload.played} and ${payload.playing}`)

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
                    <NavigationBar />
                    <div className='player-wrapper' style={{ margin: '10px' }}>
                        <Player roomId={this.props.roomId} />
                        <Members />
                        <Queue />
                    </div>
                </div >
                {this.state.memberName ? '' : <MemberName />}
            </div>
        );
    }
}

export default Room;