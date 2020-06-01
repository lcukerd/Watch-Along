import React, { Component } from 'react';
import { Form, Navbar, Nav, FormControl, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';


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
                <Form inline onSubmit={event => this.handleOnSubmit(event, () => { this.props.enterRoom(this.userName.value); this.setState({ editName: !this.state.editName }) })}>
                    <FormControl type="text" placeholder="Enter Name" className="mr-sm-2" ref={input => { this.userName = input }} defaultValue={this.props.memberName} />
                </Form>
            )
        }
        // Might cause issue of race condition
        else {
            return `Logged in as: ${this.props.memberName}`
        }
    }

    render() {
        return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand onClick={() => window.open(window.location.href.replace(`?id=${this.props.roomId}`, ''), '_self')}>
                    <img alt='' src="../../favicon.ico" width="30" height="30" className="d-inline-block align-top" />
                      Watch Along
                </Navbar.Brand>
                <Nav className="mr-auto">
                    <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={props => <Tooltip id="button-tooltip" {...props}>Share this Room's ID or the wepage's URL with friends to invite them over</Tooltip>}>
                        <Navbar.Text>
                            {`Room #${this.props.roomId}`}
                        </Navbar.Text>
                    </OverlayTrigger>
                </Nav>
                <Navbar.Collapse className="justify-content-end">
                    <Form inline style={{ marginRight: '10px', width: '35rem' }} onSubmit={event => this.handleOnSubmit(event, () => this.props.handleLoadClick(this.urlInput.value))}>
                        <FormControl style={{ width: '30rem' }} type="text" placeholder="Enter Url" className="mr-sm-2" ref={input => { this.urlInput = input; this.props.refUrlInput(input); }} defaultValue={this.props.currUrl} />
                        <Button variant="outline-light" onClick={() => this.props.handleLoadClick(this.urlInput.value)}>Load</Button>
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