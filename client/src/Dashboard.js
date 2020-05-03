import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';
import {Link} from "react-router-dom"
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StorageIcon from '@material-ui/icons/Storage';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      fileContents : [],
      dMap : []
    };
  }
  
  addDB(){
    this.setState({loading : true})
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
          // let currentHashes = this.state.fileContents;
          // currentHashes.push(result);
          // this.setState({
          //   fileContents: currentHashes
          // })
          let currentHashes = this.state.fileContents
          currentHashes.push(result)
          this.setState({fileContents : currentHashes})
          var spaceArr = currentHashes.join(" ")
          const options = { encrypt: true}
          this.props.userSession.putFile('/hashes.txt', spaceArr, options)
          .then(() => {
            // this.setState({
            //   hash: result
            // })
            //console.log(initResult)
            console.log(spaceArr)
            this.setState({loading : false})

          })

        } else {
          
          const options = { encrypt: true}
          this.props.userSession.putFile('/hashes.txt', result, options)
          .then(() => {
            // this.setState({
            //   hash: result
            // })
            //console.log(initResult)
            this.setState({fileContents : [result]})
            this.setState({loading : false})

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
              {this.state.fileContents ? this.state.fileContents.map((obj) => {
                console.log(obj)
                obj = encodeURIComponent(obj)
                  return (
                    <Link to={`database/${obj}  `} style={{color : "black", textDecoration : "none"}}>
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
              <div style={{height : "30px"}}></div>
              {this.state.loading ? <CircularProgress></CircularProgress> : null}
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

    userSession.deleteFile("/hashes.txt")
    .then(() => {
       // /hello.txt is now removed.
    })
    let options = {
      decrypt: true
    }

    userSession.getFile("/hashes.txt", options)
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

        if (fileContents == null){
          this.setState({fileContents : []})
        }
        else if (/\s/.test(fileContents)){
          this.setState({fileContents : fileContents.split(" ")})
          console.log("hello")

        }else{
          this.setState({fileContents : fileContents.split(" ")})
        }
        
        // if (fileContents){
        //   this.setState({fileContents : fileContents})
        // }else{
        //   this.setState({fileContents : []})
        // }

        console.log(this.state.fileContents, fileContents);
    });
  }
}
