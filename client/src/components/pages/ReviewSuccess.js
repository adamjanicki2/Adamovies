import React, { Component } from "react";
import "../../utilities.css";
class ReviewSuccess extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = 'Adamovies | Submission Success!'
  };

  render() {
    return (
      <div className='bg'>
        <h1 className='u-textCenter u-pageHeader'>Successfully posted review!</h1>
      </div>
    );
  }
}

export default ReviewSuccess;