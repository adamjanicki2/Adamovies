import React, { Component } from "react";
import "../../utilities.css";
import "./Notifications.css";
import { convertDate } from "../../utilities.js";
import { navigate } from "@reach/router";

class Notifications extends Component {
    constructor(props) {
      super(props);

    }
    navigateProfile = (other_id, self_id) => {
        if(other_id === self_id){
            navigate('/myprofile');
        }else{
            navigate(`/user/${other_id}`);
        }
    }

    render() {
        const mentions_to_display = this.props.mentions.map((mention, i) => 
        <div className='single-noti-container'>
            <div className='noti-title-container'>
                <h2 onClick={()=>{navigate(`/review/${mention.review_id}`)}} className='no-title-margin2 reviewtitle-link'>{mention.title}</h2>
                <h3 className='title-elements no-top-margin title-date'>• {convertDate(mention.timestamp)} • </h3>
                <div className="mention-pfp"><div className='adminpfp-name'><img src={mention.sender_picture} className='announcement-pfp'/></div>
                <h3 className='title-elements no-top-margin pfpadminlink title-adminname' onClick={()=>{this.navigateProfile(mention.sender_id, this.props.self_id)}}>{mention.sender_username}</h3></div>
            </div>
            <div className='announcement-title onepercenter'>
                <span>{mention.comment_content}</span>
            </div>
            <hr/>
        </div>
        );
      return (
        <div className='notis-container'>
            <div className='single-noti'><div className='scrolling-notis'>{mentions_to_display}</div></div>
        </div>
      );
    }
  }
  
  export default Notifications;