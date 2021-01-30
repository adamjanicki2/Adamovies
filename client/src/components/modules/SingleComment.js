import React, { Component } from "react";
import { Link } from "@reach/router";
import "./SingleComment.css";
class SingleComment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"Comment-body u-inlineBlock "+this.props.color}>
        <img src={this.props.picture} className='u-inlineBlock comment-pfp'/>
        <div className="u-bold u-inlineBlock">
          {this.props.commenter+': '} 
        </div>
        <div className="u-inlineBlock comment-block">{' '+this.props.content}</div>
      </div>
    );
  }
}
export default SingleComment;
