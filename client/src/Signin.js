import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class Signin extends Component {

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing">
        <p className="lead">
          <p>NoDeSQL</p>
          <div className="login-button">
            <Button
            color="primary"
            variant="contained"
            onClick={ handleSignIn.bind(this) }
            >
              Sign In with Blockstack
            </Button>
          </div>
        </p>
      </div>
    );
  }
}
