import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import {Link} from "react-router-dom"
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StorageIcon from '@material-ui/icons/Storage';

import db from "./internet.svg"



const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Dashboard extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
      },
      databases : [
        {
          hash : "helfhuiashfiaesuhf"
        },
        {
          hash : "helfhuiashfiaesuhf"
        },
        {
          hash : "helfhuiashfiaesuhf"
        },
        {
          hash : "helfhuiashfiaesuhf"
        }
      ]
  	};
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    return (
      !userSession.isSignInPending() ?

        <div className="dashboard-div">
          <div className="dashboard-content">
            <div>
              <div className="title-dashboard-div">
                My Databases
              </div>
              <div className="databases-div">
                {this.state.databases.map(obj => {
                  return (
                  <Link to={`database/${obj.hash}`} style={{color : "black", textDecoration : "none"}}><div className="database-item">
                    <img src={db} width="100"></img>
                  </div></Link>)
                })}
                
              </div>
            </div>
            <div className="control-div">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
              >
                Create Database
              </Button>
            </div>
          </div>
        </div>

      : null
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
