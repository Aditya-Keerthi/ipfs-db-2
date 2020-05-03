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
      username: "",
      newStatus: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false,
      databases : [{hash : "hfwduiphfaiusdh"}],
      fileContents : []
    };
  }
  
  addDB(){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:3005/createMasterDB", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(this.state.fileContents)
        if (this.state.fileContents.length !== 0) { // && this.state.fileContents !== []
          console.log(this.state.fileContents);
          console.log("not null")
          let currentHashes = this.state.fileContents;
          currentHashes.push(result);
          this.setState({
            fileContents: currentHashes
          })

        } else {
          
          const options = { encrypt: true}
          const initResult = [result]
          this.props.userSession.putFile('/hashes.json', initResult, options)
          .then(() => {
            // this.setState({
            //   hash: result
            // })
            console.log(initResult)
            this.setState({fileContents : initResult})
          })

        }

        
        // console.log(this.state.fileContents)
        // if (this.state.fileContents !== "" || this.state.fileContents !== [] || this.state.fileContents !== null || this.state.fileContent !== "null"){
        //   result = " " + result
        //   console.log(this.state.fileContents)
        //   this.setState((prevState) => {
        //     return {fileContents : prevState.fileContents.concat(result)};
        //   })
        //   var newString = this.state.fileContents
        //   const options = { encrypt: true}

        //   this.props.userSession.putFile('/hashes.txt', newString, options)
        //   .then(() => {
        //     // this.setState({
        //     //   hash: result
        //     // })
        //     console.log(this.state.fileContents)
        //   })
        // }
        // else{
          // const options = { encrypt: true}
          
          // this.props.userSession.putFile('/hashes.txt', result, options)
          // .then(() => {
          //   // this.setState({
          //   //   hash: result
          //   // })
          //   console.log([result])
          //   this.setState({fileContents : [result]})
          // })
        // }
        




      })
        .catch(error => console.log('error', error));
  }
  
  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { username } = this.state
    return (
      !userSession.isSignInPending() ?

        <div className="dashboard-div">
          <div className="dashboard-content">
            <div className="left-div">
              <div className="title-dashboard-div">
                My Databases
              </div>
              <div className="databases-div">
              {this.state.fillContents ? this.state.fileContents.map( obj => {
                  return (
                    <Link to={`database/${obj}`} style={{color : "black", textDecoration : "none"}}>
                      <div className="database-item">
                        <img src={db} width="100"></img>
                      </div>
                    </Link>
                  )
                }) : null}
                
              </div>
            </div>
            <div className="control-div">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => this.addDB()}
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
      username: userSession.loadUserData().username
    });
    this.fetchData()
  }
  fetchData() {

    const { userSession } = this.props

    // userSession.deleteFile("/hashes.json")
    // .then(() => {
    //    // /hello.txt is now removed.
    // })
    let options = {
      decrypt: true
    }

    userSession.getFile("/hashes.json", options)
    .then((fileContents) => {
        // // get & decrypt the contents of the file /message.txt
        // // assert(fileContents === "Secret hello!")
        // if (fileContents !== null){
        //   console.log(fileContents)
        //   this.setState({fileContents : fileContents})
        // }
        // else{
        //   this.setState({fileContents : []})
        // }
        
        console.log(fileContents)
        if (fileContents){
          this.setState({fileContents : fileContents})
        }else{
          this.setState({fileContents : []})
        }

        console.log(this.state.fileContents, fileContents);
    });
  }
}
