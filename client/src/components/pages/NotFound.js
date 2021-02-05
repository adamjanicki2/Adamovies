import React, { Component } from "react";
import "../../utilities.css";
import logo from "../../public/img/black180.png";
class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='bg'>
        <div className="centered-elements Adamovies-logo180"><img className="Adamovies-logo180bordering" src={logo}/></div>
        <h1 className='u-textCenter Not-found'>404 Not Found</h1>
        <h2 className='u-textCenter'>Oops! Page "{window.location.pathname}" couldn't be found.</h2>
      </div>
    );
  }
}

export default NotFound;
