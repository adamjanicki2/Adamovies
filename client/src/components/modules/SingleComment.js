import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./SingleComment.css";
import { convertDate } from "../../utilities.js";
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
    const time_to_display = convertDate(this.props.timestamp);
    return (
      <div className={"Comment-body u-inlineBlock "+this.props.color}>
        <div className="u-inlineBlock">{time_to_display+' |'}</div>
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
