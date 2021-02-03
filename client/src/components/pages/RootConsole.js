import React, { Component } from "react";
import "../../utilities.css";
import "./RootConsole.css";
import "../modules/SingleComment.css";
import { get, post, convertPicture, convertDate } from "../../utilities.js";
import { navigate } from '@reach/router';

class RootConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: undefined,
      all_announcements: undefined,
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

  render() {
    if (!this.state.all_users || !this.props.root || !this.state.all_announcements){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <h1 className='u-pageHeader u-textCenter'>Root Console</h1>
        <div className="table-container">
        <table className='styled-table'>
        <thead >
          <tr>
            <th className='tabletitletext'>Name</th>
            <th className='tabletitletext'>Username</th>
            <th className='tabletitletext'>Admin</th>
            <th className='tabletitletext'>Make Admin</th>
          </tr>
          </thead>
        <tbody>
          {this.state.all_users.map((user, i) => 
          <tr>
            <td className='table-cell'onClick={()=>{navigate(`/user/${user._id}`)}}><img src={convertPicture('20', user.picture)} className='root-pfp'/> {user.name}</td>
            <td>{user.username}</td>
            <td>{user.admin.toString()}</td>
            <td className='table-cell' onClick={()=>{this.changeAdmin(user, i)}}>{user.admin? 'Disable Admin' : 'Enable Admin'}</td>
        </tr>
    )}
    </tbody>
    </table>
    </div>

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
      </div>
    );
  }
}
export default RootConsole;
