import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
      <div className='bg'>
        <h1>Adamovies Homepage</h1>
      </div>
      </>
    );
  }
}
export default Home;
