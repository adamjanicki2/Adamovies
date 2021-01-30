import React, { Component } from "react";
import "../../utilities.css";
class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='bg'>
        <h1 className='u-textCenter'>404 Not Found</h1>
        <h3 className='u-textCenter'>Page "{window.location.pathname}" couldn't be found.</h3>
        <h3 className='u-textCenter'>Try logging in; some pages require logging in to view.</h3>
      </div>
    );
  }
}

export default NotFound;
