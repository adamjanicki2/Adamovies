import React, { Component } from "react";
import "../../utilities.css";
import "./RootConsole.css";
import "../modules/SingleComment.css";
import { get, post, convertPicture } from "../../utilities.js";
import { navigate } from '@reach/router';

class RootConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Adamovies | Root Console';
    get('/api/get_all_other_users').then((all_users) =>{
        this.setState({all_users: all_users});
    })
    
  }

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
    if (!this.state.all_users || !this.props.root){
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
      </div>
    );
  }
}
export default RootConsole;
