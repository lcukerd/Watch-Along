import { createStore } from 'redux';
import * as actions from './actions'

const initialState = {
    roomID: 0,
    socket: null,
    currUrl: '',
    name: '',
    playing: false,
    played: 0,
    alerts: undefined,
    queue: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.ADD_SOCKET:
            state.roomID = action.payload.roomId;
            state.socket = action.payload.socket;
            state.socket.emit('register', { id: state.roomID });
            break;
        case actions.UPDATE_NAME:
            if (action.payload.name && action.payload.name.replace(/\s/g, '')) {
                state.name = action.payload.name;
                state.socket.emit('syncRoomies', { id: state.roomID, name: state.name });
            }
            break;
        case actions.UPDATE_QUEUE:
            return {
                surveys: state.surveys,
                employee: action.payload.employee
            };
        case actions.UPDATE_CURR_URL:
            if (action.payload.currUrl) state.currUrl = action.payload.currUrl;
        case actions.UPDATE_PLAYER_STATUS:
            if (action.payload.playing) state.playing = action.payload.playing;
        case actions.UPDATE_TS:
            if (action.payload.played) state.played = action.payload.played;
            break;
        case actions.UPDATE_ALERT:
            state.alerts = action.payload.alerts;
            break;
    }
    return state;
}

const store = createStore(reducer);

export default store;