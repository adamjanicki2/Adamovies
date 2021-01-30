import { get, post } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";
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
        const SIZE_ = '420'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
        if (user.picture.split('/')[user.picture.split('/').length - 2] === 's96-c'){
          let arr = user.picture.split('/');
          arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
          picture_to_use = arr.join('/');
        }else if (user.picture.split('=')[user.picture.split('=').length - 1] === 's96-c'){
          let arr = user.picture.split('=');
          arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
          picture_to_use = arr.join('=');
        }else{
          picture_to_use = user.picture;
        }
      }
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
        console.log(updated);
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
    let html = this.state.name !== null? (
      <>
      <div className='bg'>
        <h1 className='u-textCenter'>Profile</h1>
        <img src={this.state.picture} className='Profile-picture'/>
        <h2 className='u-textCenter'>Welcome, {this.state.name}</h2>
        
        {this.state.status === true? <div className='u-flex Input-container'>
          <h3>Username: </h3>

          <input 
            type="text"
            placeholder="username"
            value={this.state.username? this.state.username : ''}
            onChange={this.changeUsername}
            className="Input-input"
            maxLength="20"
          /> 
        </div> : <div className='u-flex Input-container'><h3>Username: {this.state.username}</h3></div>}
        
        {this.state.status === true? <div className='u-flex Input-container'>
          <h3>Currently Watching: </h3>

          <input
            type="text"
            placeholder="Currently Watching"
            value={this.state.currently_watching? this.state.currently_watching : ''}
            onChange={this.changeCurrently}
            className="Input-input"
            maxLength="20"
          /> 
        </div> : <div className='u-flex Input-container'><h3>Currently Watching: {this.state.currently_watching}</h3></div>}
        
        {this.state.status === true? <div className='u-flex Input-container'>
          <h3>Favorite Movie: </h3>
          <input 
            type="text"
            placeholder="Favorite Movie"
            value={this.state.fav_mov? this.state.fav_mov : ''}
            onChange={this.changeMov}
            className="Input-input"
            maxLength="20"
          /> 
        </div> : <div className='u-flex Input-container'><h3>Favorite Movie: {this.state.fav_mov}</h3></div>}
        
        {this.state.status === true? <div className='u-flex Input-container'>
          <h3>Favorite TV Show: </h3>

          <input 
            type="text"
            placeholder="Favorite Show"
            value={this.state.fav_show? this.state.fav_show : ''}
            onChange={this.changeShow}
            className="Input-input"
            maxLength="20"
          /> 
        </div> : <div className='u-flex Input-container'><h3>Favorite TV Show: {this.state.fav_show}</h3></div>}

        {this.state.status === true? <div className='u-flex Input-container'>
          <h3>Bio: </h3>
          <input 
            type="text"
            placeholder="Bio"
            value={this.state.bio? this.state.bio : ''}
            onChange={this.changeBio}
            className="Input-input"
            maxLength="80"
          /> 
        </div> : <div className='u-flex Input-container'><h3>Bio: {this.state.bio}</h3></div>}
        
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
      </div>
      </>
    ) : (<h1 className='u-textCenter'>Sign In to view profile!</h1>);
    return html;
  }
}
export default Profile;
