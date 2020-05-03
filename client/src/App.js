import React, { Component } from 'react';
import Dashboard from './Dashboard.js';
import Signin from './Signin.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';
import Database from './database.js'



import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Link, Route, Switch} from "react-router-dom"
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SvgIcon from '@material-ui/core/SvgIcon';


const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4254f5',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#ffffff'
      // dark: will be calculated from palette.secondary.main,
      //contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});


export default class App extends Component {


  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <ThemeProvider theme={theme}>

          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : 
            <div className="big-container">
              <div className="navbar-div">
                <div className="logo">
                  DSaaS
                </div>
                <div className="nav-links">
                  <Link to="/dashboard" style={{textDecoration: "none", color : "black"}}><div className="nav-link"><SvgIcon color="primary"><DashboardIcon></DashboardIcon></SvgIcon>Dashboard</div></Link>
                  <Link to="/usage" style={{textDecoration: "none", color : "black"}}><div className="nav-link"><SvgIcon color="primary"><DataUsageIcon></DataUsageIcon></SvgIcon>Usage</div></Link>
                  <Link to="/statistics" style={{textDecoration: "none", color : "black"}}><div className="nav-link"><SvgIcon color="primary"><AssessmentIcon></AssessmentIcon></SvgIcon> Statistics</div></Link>


                </div>
                <div className="logout-div">
                  <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleSignOut.bind(this) }
                  >
                    Logout
                  </Button>
                </div>
              </div>
              <Switch>
                <Route exact path="/">
                  <Dashboard userSession={userSession} handleSignOut={ this.handleSignOut } />
                </Route>
                <Route exact path="/dashboard">
                  <Dashboard userSession={userSession} handleSignOut={ this.handleSignOut } />
                </Route>
                <Route path="/database/:hash">
                  <Database></Database>
                </Route>
                <Route path="/users">
                  
                </Route>
                <Route path="/">
                  
                </Route>
              </Switch>

            </div>
              
          }
        </ThemeProvider>
      </div>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}
