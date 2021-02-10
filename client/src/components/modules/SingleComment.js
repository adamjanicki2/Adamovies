import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./SingleComment.css";
import { convertDate } from "../../utilities.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
        {(this.props.self_id && this.props.admin && this.props.root) && <div className='delete-button'><FontAwesomeIcon onClick={() => {this.props.handleDeletion(this.props.commentId)}} className='trash-icon'icon={faTrashAlt} size={'1x'}/></div>}
        <div>{time_to_display} | </div>
        <div className='tinypfpcontainer'><img src={this.props.picture} className='comment-pfp'/><div onClick={() => {this.navigateProfile(this.props.color, this.props.userId)}} className='u-bold comment-username'>{this.props.commenter}: </div></div>
        <div className='comment-block'>{this.props.content}</div>
      </div>
    );
  }
}
export default SingleComment;
