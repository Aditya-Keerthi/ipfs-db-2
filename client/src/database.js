import React, { Component } from 'react';
import axios from "axios"


class Database extends Component {
    constructor(props) {
        super(props);
        this.state = {
            col1 : ["hello", "hi", "wowfuckyou"],
            col2 : [],
            col3 : [],
            col1Selected : ""
        }
    }

    componentDidMount(){

    }

    async handleClick(e){
        console.log(e.target.id)
        var others = document.getElementsByClassName("col1-item")
        for (var i = 0; i < others.length; i++) {
            others[i].classList.remove("col1-item-selected")
        }
    
        document.getElementById(e.target.id).classList.add("col1-item-selected")
        //document.getElementById(e.target.id).style.background = "grey"

        this.setState({col1Selected : e.target.value})

        // HANDLE GET REQUEST
        var hi = await this.get(e.target.value)
        console.log(hi)
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
    render() { 
        return (
            <div className="database-div">




                <div className="database-content">
                    <div className="database-title">Master database</div>
                    <div className="database-table">
                        <div className="database-column database-column-left">
                            <div className="column-title">title1</div>
                            <div className="column-content">
                                {this.state.col1.map((str, key)=> {
                                    return (
                                    <div 
                                    className="col1-item"
                                    id={`col1-${key}`}
                                    onClick={(e) => this.handleClick(e)}
                                    >{str}</div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="database-column">
                            <div className="column-title">title2</div>
                            <div className="column-content"></div>
                        </div>
                        <div className="database-column database-column-right">
                            <div className="column-title">title3</div>
                            <div className="column-content"></div>
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