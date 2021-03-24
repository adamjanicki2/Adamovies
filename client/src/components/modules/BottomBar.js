import React, { Component } from "react";
import { navigate, Link } from "@reach/router";
import "./BottomBar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
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
          <div className='Bottom-sub'>
            <div onClick={()=>{navigate('/faq')}} className='Bottom-links'>FAQ</div>
            <div> • </div>
            <div onClick={()=>{navigate('/about')}} className='Bottom-links'>About Adamovies</div>
            <div> • </div>
            <div onClick={()=>{navigate('/statistics')}} className='Bottom-links'>Stats</div>
            
        </div>
        
          <div className="Bottom-sub">
          <hr className='bottom-line'></hr>
            <div>Est. 2021 Built from scratch by Adam •</div>
            <a rel="noreferrer" target='_blank' className="Bottom-icons" href="mailto:adamoviessite@gmail.com"><FontAwesomeIcon icon={faEnvelope} size={'2x'}/></a>
            <div> • </div>
            <a rel="noreferrer" target='_blank' className="Bottom-icons" href="https://www.instagram.com/adamoviesofficial/"><FontAwesomeIcon icon={faInstagram} size={'2x'}/></a>
          </div>
        </div>
        
      );
    }
  }
  
  export default BottomBar;
