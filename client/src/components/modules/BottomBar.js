import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./BottomBar.css";

class BottomBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }

    componentDidMount (){

    };

    render() {
      return (
        <div className='Bottom-container'>
            <div onClick={()=>{navigate('/faq')}} className='Bottom-links'>FAQ</div>
            <div> | </div>
            <div onClick={()=>{navigate('/about')}} className='Bottom-links'>About Adamovies</div>
            <div> | </div>
            <a className="Bottom-links" href="/code.js" target="_blank">View Source Code</a>
        </div>
      );
    }
  }
  
  export default BottomBar;
