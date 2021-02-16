import React, { Component } from "react";
import { navigate, Link } from "@reach/router";
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
            <div> • </div>
            <div onClick={()=>{navigate('/about')}} className='Bottom-links'>About Adamovies</div>
            <div> • </div>
            <div onClick={()=>{navigate('/statistics')}} className='Bottom-links'>Stats</div>
            <div> • </div>
            <a className="Bottom-links" href="mailto:adamoviessite@gmail.com" target="_blank">Contact</a>
            <div> • </div>
            <a className="Bottom-links" href="/code.js" target="_blank">View Source Code</a>
        </div>
      );
    }
  }
  
  export default BottomBar;
