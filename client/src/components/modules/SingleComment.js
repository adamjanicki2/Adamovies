import React, { Component } from "react";
import { Link } from "@reach/router";
import "./SingleComment.css";
class SingleComment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Comment-body u-inlineBlock">
        <div className="u-bold u-inlineBlock">
          {this.props.commenter}
        </div>
        <span className="u-inlineBlock">{": " + this.props.content}</span>
      </div>
    );
  }
}
export default SingleComment;
