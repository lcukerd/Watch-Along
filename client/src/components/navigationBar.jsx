import React, { Component } from 'react';
import { Form, Navbar, Nav, FormControl, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import store from './../store'
import * as actions from './../actions'


class NavigationBar extends Component {

    state = {
        editName: false,
    }

    handleOnSubmit = (event, fn) => {
        event.preventDefault();
        event.stopPropagation();
        fn();
    }

    showLoginInfo = () => {
        if (this.state.editName) {
            return (
                <Form inline onSubmit={event => this.handleOnSubmit(event, () => { store.dispatch({ type: actions.UPDATE_NAME, payload: { name: this.userName.value } }); this.setState({ editName: !this.state.editName }) })}>
                    <FormControl type="text" placeholder="Enter Name" className="mr-sm-2" ref={input => { this.userName = input }} defaultValue={store.getState().name} />
                </Form>
            )
        }
        // Might cause issue of race condition
        else {
            return `Logged in as: ${store.getState().name}`
        }
    }

    handleLoadClick = () => {
        if (!ReactPlayer.canPlay(this.urlInput.value)) {
            let alerts = store.getState().alerts;
            alerts['cantPlay'] = 'Might not be able to play video from given URL.';
            store.dispatch({ type: actions.UPDATE_ALERT, payload: { alerts } })
        }
        store.dispatch({ type: actions.UPDATE_CURR_URL, payload: { currUrl: this.urlInput.value, playing: false, played: 0 } })
        console.log(`Syncing URL ${this.state.url}`)
        this.socket.emit('loadURL', { id: store.getState().roomID, currUrl: this.urlInput.value });
    };

    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand onClick={() => window.open(window.location.href.replace(`?id=${store.getState().roomID}`, ''), '_self')}>
                    <img alt='' src="../../favicon.ico" width="30" height="30" className="d-inline-block align-top" />
                      Watch Along
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={props => <Tooltip id="button-tooltip" {...props}>Share this Room's ID or the wepage's URL with friends to invite them over</Tooltip>}>
                        <Navbar.Text>
                            {`Room #${store.getState().roomID}`}
                        </Navbar.Text>
                    </OverlayTrigger>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Form inline style={{ marginRight: '10px', width: '35rem' }} onSubmit={event => this.handleOnSubmit(event, this.handleLoadClick)}>
                        <FormControl style={{ width: '30rem' }} type="text" placeholder="Enter Url" className="mr-sm-2" ref={input => { this.urlInput = input }} defaultValue={store.getState().currUrl} />
                        <Button variant="outline-light" onClick={this.handleLoadClick}>Load</Button>
                    </Form>
                    <OverlayTrigger placement="bottom" overlay={props => <Tooltip id="button-tooltip" {...props}>Click to edit name</Tooltip>}>
                        <Navbar.Text onClick={() => { if (!this.state.editName) this.setState({ editName: !this.state.editName }) }}>
                            {this.showLoginInfo()}
                        </Navbar.Text>
                    </OverlayTrigger>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;