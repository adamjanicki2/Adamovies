import React, { Component } from "react";
import "../../utilities.css";
class ReviewSuccess extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='bg'>
        <h1 className='u-textCenter'>Successfully posted new review!</h1>
      </div>
    );
  }
}

export default ReviewSuccess;
