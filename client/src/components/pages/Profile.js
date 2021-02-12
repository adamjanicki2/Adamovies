import { convertPicture, get, post } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";
import BottomBar from "../modules/BottomBar.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faLock, faEdit } from '@fortawesome/free-solid-svg-icons';
import MiniReview from "../modules/MiniReview.js";
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
      user_status: false,
      info_updated: false,
      update_uname: false,
      bio: null,
      locked: null,
      user_reviews: undefined,
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
      this.setState({name: user.name, googleid: user.googleid, username: user.username, picture: picture_to_use, admin: user.admin, currently_watching: user.currently_watching, fav_show: user.favorite_show, fav_mov: user.favorite_movie, bio: user.bio, locked: user.locked});
    });
    get("/api/reviews_for_user", {userId: this.props.userId}).then((user_reviews) => {
      this.setState({user_reviews: user_reviews});
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
      update_uname: true,
    });
  };

  isValidUsername = (username) => {
    let letter_count = 0;
    let space_count = 0;
    let other_count = 0;
    let alp = 'qwertyuiopasdfghjklzxcvbnm'
    for (let char of username.toLowerCase()){
      if (alp.includes(char)){
        letter_count++;
      }else if (char === ' '){
        space_count++;
      }else{
        other_count++;
      }
    }
    return space_count === 0 && letter_count>1;
  };

  changeBio = (event) => {
    this.setState({
      bio: event.target.value,
      info_updated: true,
    });
  };
  
  buttonClicked = () => {
    if (this.state.info_updated && this.state.status){
        post("/api/is_badwords", {text: [this.state.bio, this.state.fav_mov, this.state.fav_show, this.state.currently_watching]}).then((result) => {
          if(result.is_bad){
            window.alert("The use of bad words is not permitted!");
          }else{
            post("/api/update_profile", {bio: this.state.bio, googleid: this.state.googleid, new_m: this.state.fav_mov, new_s: this.state.fav_show, new_c: this.state.currently_watching}).then((updated)=>{
                this.setState({status: !this.state.status, info_updated: false});
            });
          }
        });
    }
    else{
      this.setState({status: !this.state.status, info_updated: false});
    }
  };

  usernameButtonClicked = () => {
    if(this.state.locked === false)
    {if (this.state.update_uname && this.state.user_status){
      if (this.isValidUsername(this.state.username)){
        post("/api/is_badwords", {text: [this.state.username]}).then((result) => {
          if(result.is_bad){
            window.alert("The use of bad words is not permitted!");
          }else{
            post("/api/edit_username", {googleid: this.state.googleid, username: this.state.username}).then((answer) => {
              if (answer.is_taken === true){
                window.alert("That username is already taken!");
              }else{
                window.alert('Username changed!');
                this.setState({user_status: !this.state.user_status, update_uname: false});
              }
            });
          }
        });
      }else{
        window.alert("Valid usernames must contain no spaces and at least two letters!");
      }
    }else{
      this.setState({user_status: !this.state.user_status, update_uname: false});
    }}else{
      window.alert("You're not allowed to change your username!");
    }
  }

  render() {
    if (!this.state.name){
        return (<h1 className='u-textCenter'>Sign In to view profile!</h1>);
    }
    if (this.state.user_reviews === undefined){
      return (<div></div>);
    }
    return (
        <>
        <div className='bg'>
          <h1 className='u-textCenter'>{this.state.name.split(' ')[0]}'s Profile</h1>
          {this.state.admin && <h1 className="u-textCenter">Thanks for being an admin!</h1>}
          <img src={this.state.picture} className='Profile-picture'/>
          <div className='username-box'>{(this.state.user_status && this.state.locked===false)? <div className='name-button-container'><input 
            type="text"
            placeholder="username"
            value={this.state.username? this.state.username : ''}
            onChange={this.changeUsername}
            className="Input-input u-textCenter"
            maxLength="16"
          /><FontAwesomeIcon onClick={this.usernameButtonClicked} size={'2x'} icon={faLock} className='edit-icon icon-profile-edit'/></div>
          : <div className='name-button-container'><h1 className='u-textCenter profile-uname'>{this.state.username}</h1><FontAwesomeIcon onClick={this.usernameButtonClicked} size={'2x'} className='edit-icon icon-profile-edit'icon={faEdit}/></div>}</div>
          <div className='entire-container'>
          <div className="Bio-container">
          <div className="Profile-subContainer u-textCenter">
            <h1 className="Profile-subTitle">Currently Watching</h1>
            {this.state.status? <input 
            type="text"
            placeholder="Currently Watching"
            value={this.state.currently_watching? this.state.currently_watching : ''}
            onChange={this.changeCurrently}
            className="Input-input"
            maxLength="30"
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
            maxLength="30"
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
            maxLength="30"
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
            {this.state.status? <div>Save Changes <FontAwesomeIcon size={'1x'} icon={faLock}/></div>: <div>Edit Profile <FontAwesomeIcon size={'1x'} icon={faEdit}/></div>}
          </button>
          </div>
        </div>
        {this.state.admin && <hr className='profile-line'/>}
        {this.state.admin && <h1 className='u-textCenter u-pageHeaderInter'>My Reviews</h1>}
        {this.state.admin && <div>{this.state.user_reviews[0] !== undefined? <div className='Mini-reviews-container'>{this.state.user_reviews.map((review)=> <MiniReview review={review}/>)}</div> : <h1 className='u-textCenter'>You have no reviews!</h1>}</div>}
        <BottomBar />
      </div>
        </>
      ) 
  }
}
export default Profile;
