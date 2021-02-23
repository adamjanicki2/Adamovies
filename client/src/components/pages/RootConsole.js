import React, { Component } from "react";
import "../../utilities.css";
import "./RootConsole.css";
import "../modules/SingleComment.css";
import { get, post, convertPicture, convertDate } from "../../utilities.js";
import { navigate } from '@reach/router';
import BottomBar from '../modules/BottomBar.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt, faArrowUp, faArrowDown, faSyncAlt, faLock, faLockOpen, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
class RootConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: undefined,
      all_announcements: undefined,
      all_bannedusers: undefined,
      new_comments: undefined,
      reviews_since: undefined,
      last_time: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Root Console | Adamovies';
    get('/api/get_all_other_users').then((all_users) =>{
        this.setState({all_users: all_users});
    });
    
    get('/api/get_all_announcements').then((all_announcements) =>{
      this.setState({all_announcements: all_announcements});
    });
    
    get("/api/get_all_bannedusers").then((all_banned) => {
      this.setState({all_bannedusers: all_banned});
    });

    get("/api/comments_since_timestamp", {timestamp: this.props.timestamp}).then((new_comments) => {
      this.setState({new_comments: new_comments.data});
      post("/api/update_timestamp");
    });

    get("/api/reviews_since_email").then((reviews)=>{
      this.setState({reviews_since: reviews.reviews, last_time: convertDate(reviews.last).split(" ")[0]});
    });
  }



  refreshUsername = (user, i) => {
    if (window.confirm("Click OK to refresh username for "+user.username)){
      post("/api/refresh_username", {user: user}).then((new_) => {
        let all_users_copy = this.state.all_users;
        all_users_copy[i].username = new_.new_username;
        this.setState({all_users: all_users_copy});
      });
    }
  }

  changeCommentPermissions = (user, i) => {
    const comm = user.can_comment? 'disable' : 'enable';
    if (window.confirm('Click OK to '+comm+' comment permissions for '+user.username)){
      post("/api/edit_comment_permissions", {user: user}).then((s) => {
        let all_users_copy = this.state.all_users;
        all_users_copy[i].can_comment = !user.can_comment;
        this.setState({all_users: all_users_copy});
      });
    }
  };

  lockUser = (user, i) => {
    const lock = user.locked? 'unlock':'lock';
    if (window.confirm('Click OK to '+lock+' username for '+user.username)){
      post('/api/lock_user', {user: user}).then((success) => {
        let all_users_copy = this.state.all_users;
        all_users_copy[i].locked = !user.locked;
        this.setState({all_users: all_users_copy});
      });
    }
  };

  navigateProfile = (admin_id, self_id) => {
    if(admin_id === self_id){
        navigate('/myprofile');
    }else{
        navigate(`/user/${admin_id}`);
    }
  }

  deleteAnnouncment = (announcement_id, index) => {
    if (window.confirm('Click OK to delete this announcement')){
      const new_announcements = this.state.all_announcements.slice(0, index).concat(this.state.all_announcements.slice(index+1, this.state.all_announcements.length));
      this.setState({all_announcements: new_announcements});
      post('/api/delete_announcement', {announcement_id: announcement_id});
    }
  };

  changeAdmin = (user, index) => {
    const msg = 'Click OK to '+(!user.admin? 'promote ':'demote ')+user.username;
    if (window.confirm(msg)){
      post('/api/update_user_admin', {user_id: user._id, new_admin_status: !user.admin}).then((success) => {
        let users_ = [...this.state.all_users];
        users_[index].admin = !user.admin;
        this.setState({all_users: users_});
      })
    }
  }

  banUser = (user, index) => {
    const msg = "Click OK to ban "+user.username;
    if (window.confirm(msg)){
      const new_all_users =  this.state.all_users.slice(0, index).concat(this.state.all_users.slice(index+1, this.state.all_users.length));
      const new_banned_users = [{name: user.name, googleid: user.googleid}].concat(this.state.all_bannedusers);
      this.setState({all_users: new_all_users, all_bannedusers: new_banned_users});
      post("/api/ban_user", {user: user});
    }
  };

  unbanUser = (user, index) => {
    const msg = "Click OK to unban "+user.name;
    if (window.confirm(msg)){
      const new_banned =  this.state.all_bannedusers.slice(0, index).concat(this.state.all_bannedusers.slice(index+1, this.state.all_bannedusers.length));
      this.setState({all_bannedusers: new_banned});
      post("/api/unban_user", {user: user});
    }
  };

  sendEmail = () => {
    if (this.state.reviews_since.length !== undefined && this.state.reviews_since.length === 0){
      window.alert("No new reviews to send!");
    }else{
      if (window.confirm("Click OK to send digest email")){
        post("/api/send_email").then((_) => {
          navigate("/");
        });
      }
    }
  };

  render() {
    if (!this.state.all_users || !this.props.root || !this.state.all_announcements || !this.state.all_bannedusers || !this.state.new_comments || !this.state.reviews_since){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <h1 className='u-pageHeader u-textCenter'>Send Digest</h1>
        <div className='emails-container'>
          <h1 className='u-textCenter'>New Reviews Since {this.state.last_time}</h1>
          <ul>{this.state.reviews_since.map((review, i) => <li><div className='email-title-text'onClick={()=>{navigate(`/review/${review._id}`)}}>{review.title+`${review.season !== 0? `${review.episode !== 0? ` S${review.season}E${review.episode}`: ` S${review.season}`}` : ''}`}</div></li>)}</ul>
          <button
          type="submit"
          className="Submit-button-draft u-pointer"
          value="Submit"
          onClick={this.sendEmail}
        >
          Send Digest
        </button>
        <div> </div>
        </div>
        <h1 className='u-pageHeader u-textCenter'>New Comments</h1>
        {this.state.new_comments.length !== undefined && this.state.new_comments.length > 0? <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Title</th>
            <th className='tabletitletext'>Amount</th>
          </tr>
          </thead>
        <tbody>
          {this.state.new_comments.map((comment) => 
          <tr>
            <td><div className='table-cell' onClick={()=>{navigate(`/review/${comment[0]}`)}}>{comment[2]}</div></td>
            <td>{comment[1]}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div> : <h2 className='u-textCenter'>No new comments!</h2>}
        <h1 className='u-pageHeader u-textCenter'>Announcements</h1>
        <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Admin Username</th>
            <th className='tabletitletext'>Title</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_announcements.map((announcement, i) => 
          <tr>
            <td><div className='table-cell' onClick={()=>{this.navigateProfile(announcement.admin_id, this.props.userId)}}><img src={convertPicture('20', announcement.admin_picture)} className='root-pfp'/> {announcement.admin_username}</div></td>
            <td><div><FontAwesomeIcon onClick={()=>{this.deleteAnnouncment(announcement._id, i)}} className='trash-icon'icon={faTrashAlt} size={'1x'}/>{announcement.title} ({convertDate(announcement.timestamp)})</div></td>
        </tr>
    )}
    </tbody>
    </table>
    </div>
      <h1 className='u-pageHeader u-textCenter'>Users</h1>
        <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Name</th>
            <th className='tabletitletext'>Actions</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_users.map((user, i) => 
          <tr>
            <td ><div className='table-cell'onClick={()=>{navigate(`/user/${user._id}`)}}><img src={convertPicture('20', user.picture)} className='root-pfp'/> {user.name+` (${user.username})`}</div></td>
            <td><div><FontAwesomeIcon className={user.admin? 'arrow-down':'arrow-up'} onClick={()=>{this.changeAdmin(user, i)}} icon={user.admin? faArrowDown : faArrowUp} /><FontAwesomeIcon className='refresh-icon' icon={faSyncAlt} size={'1x'} onClick={()=>{this.refreshUsername(user, i)}} /><FontAwesomeIcon className='mic-icon' icon={user.can_comment? faMicrophoneSlash : faMicrophone} size={'1x'} onClick={()=>{this.changeCommentPermissions(user, i)}} /><FontAwesomeIcon onClick={()=>{this.lockUser(user, i)}} className='lock-icon'size={'1x'} icon={user.locked? faLockOpen : faLock}/><FontAwesomeIcon onClick={()=>{this.banUser(user, i)}} className='trash-icon'icon={faTrashAlt} size={'1x'}/></div></td>
        </tr>
    )}
    </tbody>
    </table>
    </div>
    <h1 className='u-pageHeader u-textCenter'>Banned Users</h1>
    {this.state.all_bannedusers.length !== undefined && this.state.all_bannedusers.length > 0?<div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Name</th>
            {/* <th className='tabletitletext'>Google ID</th> */}
            <th className='tabletitletext'>Action</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_bannedusers.map((user, i) => 
          <tr>
            <td>{user.name} ({user.googleid})</td>
            {/* <td>{user.googleid}</td> */}
            <td className='table-cell' onClick={()=>{this.unbanUser(user, i)}}>Unban {user.name}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div> : <h2 className='u-textCenter'>No banned users!</h2>}

    <BottomBar/>
      </div>
    );
  }
}
export default RootConsole;
