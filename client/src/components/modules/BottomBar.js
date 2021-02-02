import React, { Component,useEffect } from "react";
import { Link, navigate } from "@reach/router";
import "./BottomBar.css";
import logo from '../../public/img/adamovies45.png';
import { convertPicture } from "../../utilities.js";

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
        </div>
      );
    }
  }
  
  export default BottomBar;