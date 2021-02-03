import React, { Component } from "react";
import "../../utilities.css";
import "./RootConsole.css";
import "../modules/SingleComment.css";
import { get, post, convertPicture, convertDate } from "../../utilities.js";
import { navigate } from '@reach/router';
import BottomBar from '../modules/BottomBar.js';

class RootConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: undefined,
      all_announcements: undefined,
      all_bannedusers: undefined,
      new_comments: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Adamovies | Root Console';
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
  }

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

  render() {
    if (!this.state.all_users || !this.props.root || !this.state.all_announcements || !this.state.all_bannedusers || !this.state.new_comments){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <h1 className='u-pageHeader u-textCenter'>New Comments</h1>
        <div className="table-container">
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
            <td className='table-cell' onClick={()=>{navigate(`/review/${comment[0]}`)}}>{comment[2]}</td>
            <td>{comment[1]}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div>
        <h1 className='u-pageHeader u-textCenter'>Announcements</h1>
        <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Admin Username</th>
            <th className='tabletitletext'>Title</th>
            <th className='tabletitletext'>Timestamp</th>
            <th className='tabletitletext'>Action</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_announcements.map((announcement, i) => 
          <tr>
            <td className='table-cell' onClick={()=>{this.navigateProfile(announcement.admin_id, this.props.userId)}}><img src={convertPicture('20', announcement.admin_picture)} className='root-pfp'/> {announcement.admin_username}</td>
            <td>{announcement.title}</td>
            <td>{convertDate(announcement.timestamp)}</td>
            <td className='table-cell' onClick={()=>{this.deleteAnnouncment(announcement._id, i)}}>Delete</td>
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
            <th className='tabletitletext'>Username</th>
            <th className='tabletitletext'>Make Admin</th>
            <th className='tabletitletext'>Ban User</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_users.map((user, i) => 
          <tr>
            <td className='table-cell'onClick={()=>{navigate(`/user/${user._id}`)}}><img src={convertPicture('20', user.picture)} className='root-pfp'/> {user.name}</td>
            <td>{user.username}</td>
            <td className='table-cell' onClick={()=>{this.changeAdmin(user, i)}}>{user.admin? 'Disable Admin' : 'Enable Admin'}</td>
            <td className='table-cell' onClick={()=>{this.banUser(user, i)}}>Ban {user.username}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div>
    <h1 className='u-pageHeader u-textCenter'>Banned Users</h1>
    <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Name</th>
            <th className='tabletitletext'>Google ID</th>
            <th className='tabletitletext'>Action</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_bannedusers.map((user, i) => 
          <tr>
            <td>{user.name}</td>
            <td>{user.googleid}</td>
            <td className='table-cell' onClick={()=>{this.unbanUser(user, i)}}>Unban {user.name}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div>

    <BottomBar/>
      </div>
    );
  }
}
export default RootConsole;
