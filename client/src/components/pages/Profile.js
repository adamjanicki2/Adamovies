import { convertPicture, get, post } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";
import BottomBar from "../modules/BottomBar.js";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      googleid: null,
      picture: null,
      admin: null,
      username: null,
      currently_watching: null,
      fav_mov: null,
      fav_show: null,
      status: false,
      info_updated: false,
      update_uname: false,
      bio: null, 
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      let picture_to_use = null;
      if (user.picture !== null){
        const SIZE_ = '450'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
        picture_to_use = convertPicture(SIZE_, user.picture);
      }
      document.title = "Adamovies | My Profile"
      this.setState({name: user.name, googleid: user.googleid, username: user.username, picture: picture_to_use, admin: user.admin, currently_watching: user.currently_watching, fav_show: user.favorite_show, fav_mov: user.favorite_movie, bio: user.bio});
    });
  }

  changeCurrently = (event) => {
    this.setState({
      currently_watching: event.target.value,
      info_updated: true,
    });
  };

  changeMov = (event) => {
    this.setState({
      fav_mov: event.target.value,
      info_updated: true,
    });
  };

  changeShow = (event) => {
    this.setState({
      fav_show: event.target.value,
      info_updated: true,
    });
  };

  changeUsername = (event) => {
    this.setState({
      username: event.target.value,
      info_updated: true,
      update_uname: true,
    });
  };

  changeBio = (event) => {
    this.setState({
      bio: event.target.value,
      info_updated: true,
    });
  };
  
  buttonClicked = () => {
    if (this.state.info_updated && this.state.status){
      post("/api/update_profile", {bio: this.state.bio, updated_uname: this.state.update_uname, googleid: this.state.googleid, new_username: this.state.username, new_m: this.state.fav_mov, new_s: this.state.fav_show, new_c: this.state.currently_watching}).then((updated)=>{
        if (updated.is_valid){
          this.setState({status: !this.state.status, info_updated: false});
        }else{
          window.alert("That username is already taken!");
        }
        
      });
    }
    else{
      this.setState({status: !this.state.status, info_updated: false, update_uname: false,});
    }
  };

  render() {
    if (!this.state.name){
        return (<h1 className='u-textCenter'>Sign In to view profile!</h1>);
    }
    return (
        <>
        <div className='bg'>
          <h1 className='u-textCenter'>{this.state.name.split(' ')[0]}'s Profile</h1>
          {this.state.admin && <h1 className="u-textCenter">Thanks for being an admin!</h1>}
          <img src={this.state.picture} className='Profile-picture'/>
          <div className='username-box'>{this.state.status? <input 
            type="text"
            placeholder="username"
            value={this.state.username? this.state.username : ''}
            onChange={this.changeUsername}
            className="Input-input u-textCenter"
            maxLength="20"
          />
          : <h1 className='u-textCenter profile-uname'>{this.state.username}</h1>}</div>
          
          <hr className='profile-line'/>
          <div className="Bio-container">
          <div className="Profile-subContainer u-textCenter">
            <h1 className="Profile-subTitle">Currently Watching</h1>
            {this.state.status? <input 
            type="text"
            placeholder="Bio"
            value={this.state.currently_watching? this.state.currently_watching : ''}
            onChange={this.changeCurrently}
            className="Input-input"
            maxLength="20"
          /> : <h2>{this.state.currently_watching}</h2>}
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Favorite Movie</h4>
            {this.state.status? <input 
            type="text"
            placeholder="Favorite Movie"
            value={this.state.fav_mov? this.state.fav_mov : ''}
            onChange={this.changeMov}
            className="Input-input"
            maxLength="20"
          /> : <h2>{this.state.fav_mov}</h2>}
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Favorite TV Show</h4>
            {this.state.status? <input 
            type="text"
            placeholder="Favorite Show"
            value={this.state.fav_show? this.state.fav_show : ''}
            onChange={this.changeShow}
            className="Input-input"
            maxLength="20"
          /> : <h2>{this.state.fav_show}</h2>}
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h1 className="Profile-subTitle">Bio</h1>
            {this.state.status? <input 
            type="text"
            placeholder="Bio"
            value={this.state.bio? this.state.bio : ''}
            onChange={this.changeBio}
            className="Input-input"
            maxLength="80"
          /> : <h2>{this.state.bio}</h2>}
          </div>
        </div>

        <div className='button-container'>
          <button
            type="submit"
            className="status-button"
            value="Submit"
            onClick={this.buttonClicked}
            >
            {this.state.status? 'Save Changes': 'Edit Profile'}
          </button>
        </div>
        <BottomBar />
      </div>
        </>
      ) 
  }
}
export default Profile;
