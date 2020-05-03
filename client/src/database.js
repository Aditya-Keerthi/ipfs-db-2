import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


class Database extends Component {
    constructor(props) {
        super(props);
        this.state = {
            col1 : [],
            col2 : [],
            col3 : [],
            col1Selected : "",
        }
        console.log(this.props.userSession)
    }


    get = async hash => {
        const url = 'https://gateway.ipfs.io/ipfs/' + hash;
        
        try {
          const response = await axios.get(url);
          return response.data
      
        } catch (error) {
          console.log(error);
        }
      
    };
    
    componentDidMount(){
        
        var hash = this.props.hash
        //console.log(this.props.match)
        hash = decodeURIComponent(hash)
        console.log(hash)
        this.setState({hash : hash})

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"hash": hash});
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch("http://localhost:3005/getDB/encrypted", requestOptions)
          .then(response => response.text())
          .then( async result => {
              var db = await this.get(result)

              //console.log(JSON.parse(result))
              
              var keys = []
              Object.entries(db).forEach(([key, value]) => {
                keys.push(key)
                 });
                this.setState({col1 : keys})
                this.setState({loading : false})
            })
          .catch(error => console.log('error', error));
     
          
    }

    async handleClick(e){
        //console.log(e.target.id)
        var others = document.getElementsByClassName("col1-item")
        for (var i = 0; i < others.length; i++) {
            others[i].classList.remove("col1-item-selected")
        }
    
        document.getElementById(e.target.id).classList.add("col1-item-selected")
        //document.getElementById(e.target.id).style.background = "grey"

        this.setState({col1Selected : e.target.value})

        // HANDLE GET REQUEST
        //var hi = await this.get(e.target.value)
        //console.log(hi)

        //console.log(e.target.textContent)

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        //console.log(this.state.hash)
        // var options = await this.get(this.state.hash);
        //console.log(this.state.hash)
        // const possKeys = Object.keys(options);

        var raw = JSON.stringify({"key":this.state.hash,"dir": e.target.textContent + "." + "two"});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3005/query", requestOptions)
        .then(response => response.text())
        .then(result => {
            var array = JSON.parse(result)
            var col2 = array[0]
            var col3 = array[1]
            this.setState({col2 : col2 , col3 : col3})
        })
        .catch(error => console.log('error', error));
            }

    // get = async hash => {
    //     const url = 'https://gateway.ipfs.io/ipfs/' + hash;
        
    //     try {
    //       const response = await axios.get(url);
    //       return response.data
      
    //     } catch (error) {
    //       console.log(error);
    //     }
      
    // };
    addData(){
        this.setState({loading : true})
        var title = document.getElementById("title").value
        var key = document.getElementById("key").value
        var value = document.getElementById("value").value

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var obj = {}
        obj[key] = value

        var raw = JSON.stringify({"doctitle": title ,"key": this.state.hash ,"obj": obj});
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://localhost:3005/setValues", requestOptions)
          .then(response => response.text())
          .then(result => {
            var newHash = result
            let options = {
                decrypt: true
              }
            let newFile;
            this.props.userSession.getFile("/hashes.txt", options)
            .then((fileContents) => {
                var org = `${this.state.hash}`
                console.log(org)
               newFile = fileContents.replace(org, newHash)
               console.log(newFile)
               this.props.userSession.putFile('/hashes.txt', newFile, options)
                .then(() => {
                    // this.setState({
                    //   hash: result
                    // })
                    //console.log(initResult)
                    //console.log(spaceArr)
                    
                    this.setState({hash : newHash})
                    this.props.history.push(`/database/${ encodeURIComponent(newHash)}`)
                    window.location.reload()
                })
               
            });
        })
          .catch(error => console.log('error', error));


    }
    render() { 
        return (
            <div className="database-div">
                <div className="database-content">
                    <div className="database-title">Master database ({this.state.hash})</div>
                    <div className="database-table">
                        <div className="database-column database-column-left">
                            <div className="column-title">Document</div>
                            <div className="column-content">
                                {this.state.col1.map((str, key)=> {
                                    if (key !== 0){
                                        return (
                                            <div 
                                            className="col1-item"
                                            id={`col1-${key}`}
                                            onClick={(e) => this.handleClick(e)}
                                            >{str}</div>
                                            )
                                    }
                                })}
                            </div>
                        </div>
                        <div className="database-column">
                            <div className="column-title">Key</div>
                            <div className="column-content">
                                <div className="col1-item"> 
                                    {this.state.col2}
                                </div>
                            </div>
                        </div>
                        <div className="database-column database-column-right">
                            <div className="column-title">Value</div>
                            <div className="column-content">
                                <div className="col1-item"> 
                                    {this.state.col3}
                                </div>
                            </div>
                        </div>
                <div className="form-div">
                    <TextField id="title" placeholder="Title"></TextField>
                    <TextField id="key" placeholder="Key"></TextField>
                    <TextField id="value" placeholder="Value"></TextField>

                    <Button variant="contained"
                color="primary" onClick={() => {this.addData()}} >Add/Update Data</Button>
                {this.state.loading ? <CircularProgress ></CircularProgress> : null}
                </div>
             </div>
                       

                    {/*<div className="database-info">
                        <div className="database-table">
                            <div className="database-col"></div>
                            <div className="database-col"></div>
                            <div className="database-col"></div>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }
}
 
export default Database;