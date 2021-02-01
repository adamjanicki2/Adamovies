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
      <div className={"Comment-body "+this.props.color}>
        <div className='u-flexInline'>{(this.props.self_id && this.props.admin && this.props.root) && <div className='delete-button' onClick={() => {this.props.handleDeletion(this.props.commentId)}}>Delete</div>} {time_to_display+' |'}</div>
        <img src={this.props.picture} className='comment-pfp'/>
        <div className="u-bold comment-username" onClick={() => {this.navigateProfile(this.props.color, this.props.userId)}}>
          {this.props.commenter+':'} 
        </div>
        <div className='comment-block'>{' '+this.props.content}</div>
      </div>
    );
  }
}
export default SingleComment;
