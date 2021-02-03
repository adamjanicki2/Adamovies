import React, { Component } from "react";
import "../../utilities.css";
import "./Announcements.css";
import { get, post, convertDate, convertPicture } from "../../utilities.js";
import { navigate } from "@reach/router";
import { NewAnnouncement } from "./NewInput.js";

class Announcements extends Component {
    constructor(props) {
      super(props);

    }
  
    navigateProfile = (admin_id, self_id) => {
        if(admin_id === self_id){
            navigate('/myprofile');
        }else{
            navigate(`/user/${admin_id}`);
        }
    }

    render() {
        const announcements_to_display = this.props.recent_announcements.map((announcement, i) => 
        <div>
            <div className='announcement-title'>
                <h2 className='title-elements'>{announcement.title}</h2>
                <h3 className='title-elements'>{convertDate(announcement.timestamp)}</h3>
                <h3 className='title-elements'>|</h3>
                <img src={announcement.admin_picture} className='announcement-pfp'/> 
                <h3 className='title-elements pfpadminlink' onClick={()=>{this.navigateProfile(announcement.admin_id, this.props.self_id)}}>{announcement.admin_username}</h3>
            </div>
            <p>{announcement.content}</p>
            <hr/>
            {i == this.props.recent_announcements.length - 1 && this.props.admin && <NewAnnouncement onSubmit={this.props.onSubmit}/>}
        </div>
        );
      return (
        <div className='announcements-container'>
            <div className='single-announcement'>{announcements_to_display}</div>
        </div>
      );
    }
  }
  
  export default Announcements;