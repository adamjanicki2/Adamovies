import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID

class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <h1>Adamovies Homepage</h1>
      </>
    );
  }
}
export default Home;
