import { get } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      picture: null,
      admin: null,
      currently_watching: null,
      fav_mov: null,
      fav_show: null,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      let picture_to_use = null;
      if (user.picture !== null){
        const SIZE_ = '384'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
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
      this.setState({name: user.name, picture: picture_to_use, admin: user.admin, currently_watching: user.currently_watching, fav_show: user.favorite_show, fav_mov: user.favorite_movie});
    });
  }

  render() {
    let html = this.state.name !== null? (
      <>
      <div className='bg'>
        <h1 className='u-textCenter'>Profile</h1>
        <img src={this.state.picture} className='Profile-picture'/>
        <h2 className='u-textCenter'>Welcome, {this.state.name}</h2>
        <h3 className='u-textCenter'>Currenly Watching: {this.state.currently_watching}</h3>
        <h3 className='u-textCenter'>Favorite Movie: {this.state.fav_mov}</h3>
        <h3 className='u-textCenter'>Favorite Show: {this.state.fav_show}</h3>
      </div>
      </>
    ) : (<h1 className='u-textCenter'>Sign In to view profile!</h1>);
    return html;
  }
}
export default Profile;
