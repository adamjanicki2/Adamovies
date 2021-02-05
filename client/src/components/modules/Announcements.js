import React, { Component } from "react";
import "../../utilities.css";
import "./Announcements.css";
import { convertDate } from "../../utilities.js";
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
        <div className=''>
            <div className=''>
                <h2 className='no-title-margin'>{announcement.title}</h2>
            </div>
            <div className='announcement-title onepercenter'><h3 className='title-elements title-date'>{convertDate(announcement.timestamp)} | </h3><div className='adminpfp-name'><img src={announcement.admin_picture} className='announcement-pfp'/> 
                <h3 className='title-elements pfpadminlink title-adminname' onClick={()=>{this.navigateProfile(announcement.admin_id, this.props.self_id)}}>{announcement.admin_username}</h3></div>
                </div>
            <p>{announcement.content}</p>
            <hr/>
        </div>
        );
      return (
        <div className='announcements-container'>
            <div className='single-announcement'><div className='scrolling-announcements'>{announcements_to_display}</div><div>{this.props.admin && <NewAnnouncement onSubmit={this.props.onSubmit}/>}</div></div>
        </div>
      );
    }
  }
  
  export default Announcements;