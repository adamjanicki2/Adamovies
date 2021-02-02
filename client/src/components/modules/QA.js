import React, { Component } from "react";
import "../../utilities.css";
import "../pages/FAQ.css";
class QA extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      
    return (
      <div className='QA-container u-auto'>
        <h1 className='QA-text'>Q: {this.props.question}</h1>
        <hr className='line-QA'/>
        <h1 className='QA-text'>A: {this.props.answer}</h1>       
      </div>
    );
  }
}

export default QA;
