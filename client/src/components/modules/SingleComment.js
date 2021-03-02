import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./SingleComment.css";
import { convertDate } from "../../utilities.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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
    let text_to_display = [];
    let mentioned = false;
    if (this.props.content.includes("@") && this.props.self_id !== undefined){
      let content_copy = this.props.content;
      const ats = this.props.content.split(" ").filter((word) => word.toLowerCase() === '@'+this.props.self_username.toLowerCase())
      for (const at of ats){
        mentioned = true;
        content_copy = content_copy.replace(at, '@'+this.props.self_username);
      }
      
      const content_list = content_copy.split('@'+this.props.self_username);
      for (let i = 0; i<content_list.length; i++){
        text_to_display.push(content_list[i]);
        if (i < content_list.length-1){
          text_to_display.push(<span className='u-bold boldedname'>{'@'+this.props.self_username}</span>);
        }
      }
    }
    return (
      <div className={"Comment-body "+this.props.color}>
        {(this.props.self_id && this.props.admin && this.props.root) && <div className='delete-button'><FontAwesomeIcon onClick={() => {this.props.handleDeletion(this.props.commentId)}} className='trash-icon'icon={faTrashAlt} size={'1x'}/></div>}
        <div>{time_to_display} | </div>
        <div className='tinypfpcontainer'><img src={this.props.picture} className='comment-pfp'/><div onClick={() => {this.navigateProfile(this.props.color, this.props.userId)}} className='u-bold comment-username'>{this.props.commenter}</div>{this.props.user_admin === true && <div className="check-background-comment"><FontAwesomeIcon size={"1x"} className="check-icon"icon={faCheckCircle}/></div>}:</div>
        {!mentioned && <div className='comment-block'>{this.props.content}</div>}
        {mentioned && <div className='comment-block'>{text_to_display}</div>}
      </div>
    );
  }
}
export default SingleComment;
