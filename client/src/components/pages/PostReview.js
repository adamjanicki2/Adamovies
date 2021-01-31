import React, { Component } from "react";
import { get } from "../../utilities";

class PostReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }
  componentDidMount() {
    document.title = "Adamovies | Post Review"
    get("/api/whoami").then((user) => {
      this.setState({user: user});
    });
  };
  render() {
    if (!this.state.user){
      return (<div></div>);
    }
    return (
      <div className="bg">
        <h1 className="u-textCenter">Welcome back, {this.state.user.name.split(' ')[0]}!</h1>
      </div>
    );
  }
}

export default PostReview;
