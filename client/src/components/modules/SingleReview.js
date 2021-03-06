import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./SingleReview.css";
import { convertDate, get, convertPicture } from "../../utilities.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faHeart, faComment, faFilm, faTv, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
class SingleReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments_for_review: 0,
    };
  }
  componentDidMount(){
    get("/api/get_comments_for_review", {review_id: this.props.review._id, number: true}).then((result) => {
      this.setState({comments_for_review: result.number_comments});
    });
  };
  navigateAdmin = (admin, self) => {
    if(admin  === self) navigate("/myprofile");
    else navigate(`/user/${admin}`);
  };
  render() {
    const heart_style = this.props.unliked? 'grey-heart': 'card-heart';
    return (
      <div className="Review-container u-textCenter Title-link">
        <div className='u-pointer' onClick={() => {navigate(`/review/${this.props.review._id}`)}}>
        <h1>{this.props.review.title} ({this.props.review.release_year})</h1>
        <div className='review-subtitlecontainer'>
          <FontAwesomeIcon className='media-icon' icon={this.props.review.type==='movie'? faFilm:faTv} size={'2x'}/>
          <h2 className='textnomargin'> • {this.props.review.genre} {this.props.review.season !== 0 && `• Season ${this.props.review.season}`} {this.props.review.episode !== 0 && ` Episode ${this.props.review.episode}`}</h2>
        </div>
        <img src={this.props.review.img_url} className='Poster-img'/>
        <div className='movie-info'>
          <h2 className='subpicturetext'>{convertDate(this.props.review.timestamp).split(' ')[0]}</h2>
          <h2 className='bar-spacing subpicturetext'>•</h2><h2 className='subpicturetext'>{this.props.review.rating}%</h2><h2 className='bar-spacing subpicturetext'>•</h2>
          <FontAwesomeIcon className={heart_style} icon={faHeart} size={'2x'}/>
          <h2 className='subpicturetext'>{this.props.review.likes}</h2>
          <h2 className='bar-spacing subpicturetext'>•</h2>
          <FontAwesomeIcon className='comment-icon' icon={faComment} size={'2x'}/>
          <h2 className='subpicturetext'>{this.state.comments_for_review}</h2>
        </div>
        </div>
        <div className='Review-linkcontainer'>
          <img className='reviewcard-pfp' src={this.props.review.admin_picture}/>
          <h3 className='no-margin admin-link' onClick={()=>{this.navigateAdmin(this.props.review.admin_id,this.props.userId)}}>{this.props.review.admin_username}</h3>
          {this.props.root && <FontAwesomeIcon onClick={()=>{navigate(`/edit_review/${this.props.review._id}`)}}icon={faEdit} size={'1x'} className='edit-icon'/>}
          {this.props.root && <FontAwesomeIcon onClick={()=>{this.props.delete_review(this.props.review._id)}} className='trash-icon'icon={faTrashAlt} size={'1x'}/>}
        </div>
      </div>
    );
  }
}

export default SingleReview;
