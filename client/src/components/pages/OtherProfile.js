import { get, convertPicture } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";

class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  componentDidMount() {
    get("/api/get_single_user", {_id: this.props.userId}).then((user) => {
        let picture_to_use = null;
      if (user.picture !== null){
        const SIZE_ = '450'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
        picture_to_use = convertPicture(SIZE_, user.picture);
      }
        document.title = "Adamovies | User: "+user.username
        user.picture = picture_to_use;
        this.setState({user: user});
    });
  }

  render() {
    if (!this.state.user){
        return (<div></div>);
    }
    return (
        <>
        <div className='bg'>
          {this.state.user.admin && <h1 className="u-textCenter">(Admin)</h1>}
          <img src={this.state.user.picture} className='Profile-picture'/>
          <h1 className='u-textCenter profile-uname'>{this.state.user.username}</h1>
          <hr className='profile-line'/>
          <div className="u-flex">
          <div className="Profile-subContainer u-textCenter">
            <h1 className="Profile-subTitle">Currently Watching</h1>
            <h2>
              {this.state.user.currently_watching}
            </h2>
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Favorite Movie</h4>
            <h2>
              {this.state.user.favorite_movie}
            </h2>
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h4 className="Profile-subTitle">Favorite TV Show</h4>
            <h2>
              {this.state.user.favorite_show}
            </h2>
          </div>
          <div className="Profile-subContainer u-textCenter">
            <h1 className="Profile-subTitle">Bio</h1>
            <h2>
              {this.state.user.bio}
            </h2>
          </div>
        </div>
        </div>
        </>
      ) 
  }
}
export default OtherProfile;
