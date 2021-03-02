import { get, convertPicture } from "../../utilities.js";
import React, { Component } from "react";
import "../../utilities.css";
import "./Profile.css";
import BottomBar from "../modules/BottomBar.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import MiniReview from "../modules/MiniReview.js";

import "./ReviewPage.css";
class OtherProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      user_reviews: undefined,
    };
  }

  componentDidMount() {
    get("/api/get_single_user", {_id: this.props.userId}).then((user) => {
        let picture_to_use = null;
      if (user.picture !== null){
        const SIZE_ = '450'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
        picture_to_use = convertPicture(SIZE_, user.picture);
      }
        const type_user = user.admin? 'Admin: ' : 'User: ';
        document.title = type_user+user.username+" | Adamovies";
        user.picture = picture_to_use;
        this.setState({user: user});
    });
    get("/api/reviews_for_user", {userId: this.props.userId}).then((user_revs) => {
      this.setState({user_reviews: user_revs});
    });
  }

  render() {
    if (!this.state.user || this.state.user_reviews === undefined){
        return (<div></div>);
    }
    return (
        <>
        <div className='bg'>
        <div className='back-container' onClick={()=>{history.back()}}><FontAwesomeIcon icon={faChevronLeft} size={'2x'}/><h2 className='no-margin'>Back</h2></div>
          {this.state.user.admin && <h1 className="u-textCenter">(Admin)</h1>}
          <img src={this.state.user.picture} className='Profile-picture'/>
          <div className="user-check-container-other"><h1 className='u-textCenter profile-uname'>{this.state.user.username}</h1>{this.state.user.admin && <div className='check-background'><FontAwesomeIcon icon={faCheckCircle} size={'3x'} className='check-icon'/></div>}</div>
          {/* <hr className='profile-line'/> */}
          <div className='entire-container'>
          <div className="Bio-container">
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
        {this.state.user.admin && <hr className='profile-line'/>}
        {this.state.user.admin && <h1 className='u-textCenter u-pageHeaderInter'>{this.state.user.username}'s Reviews</h1>}
        {this.state.user.admin && <div>{this.state.user_reviews[0] !== undefined? <div className='Mini-reviews-container'>{this.state.user_reviews.map((review)=> <MiniReview review={review}/>)}</div> : <h1 className='u-textCenter'>{this.state.user.username} has no reviews!</h1>}</div>}
        <BottomBar/>
        </div>
        </>
      ) 
  }
}
export default OtherProfile;
