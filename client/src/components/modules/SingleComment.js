import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./SingleComment.css";
class SingleComment extends Component {
  constructor(props) {
    super(props);
  }

  navigateProfile = (classN, userId) => {
    if(classN === 'Self-background'){
      //its ourself
      navigate("/myprofile");
    }else{
      navigate(`/user/${userId}`);
    }
  };
  
  render() {
    return (
      <div className={"Comment-body u-inlineBlock "+this.props.color}>
        <img src={this.props.picture} className='u-inlineBlock comment-pfp'/>
        <div className="u-bold u-inlineBlock comment-username" onClick={() => {this.navigateProfile(this.props.color, this.props.userId)}}>
          {this.props.commenter+': '} 
        </div>
        <div className="u-inlineBlock comment-block">{' '+this.props.content}</div>
      </div>
    );
  }
}
export default SingleComment;
