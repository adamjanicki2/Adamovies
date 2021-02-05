import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import "./SingleReview.css";
import { convertDate, get, convertPicture } from "../../utilities.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
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
        <h2>{this.props.review.season !== 0 && `Season ${this.props.review.season}`} {this.props.review.episode !== 0 && `Episode ${this.props.review.episode}`} {(this.props.review.season !== 0 || this.props.review.episode !== 0) && ' | '} {this.props.review.genre}</h2>
        {/* {this.props.review.season === 0 && this.props.review.episode === 0 && <h2 className='disguise'>.</h2>} */}
        <img src={this.props.review.img_url} className='Poster-img'/>
        <div className='movie-info'>
          <h2>{convertDate(this.props.review.timestamp).split(' ')[0]}</h2>
          <h2 className='bar-spacing'>|</h2><h2>{this.props.review.rating}%</h2><h2 className='bar-spacing'>|</h2>
          <FontAwesomeIcon className={heart_style} icon={faHeart} size={'2x'}/>
          <h2>{this.props.review.likes}</h2>
          <h2 className='bar-spacing'>|</h2>
          <FontAwesomeIcon className='comment-icon' icon={faComment} size={'2x'}/>
          <h2>{this.state.comments_for_review}</h2>
        </div>
        </div>
        <div className='Review-linkcontainer'>
        {/* <Link to={`/review/${this.props.review._id}`} className="u-linked">
            Read {this.props.review.admin_username}'s Review
        </Link> */}
        <img className='reviewcard-pfp' src={this.props.review.admin_picture}/>
        <h3 className='no-margin admin-link' onClick={()=>{this.navigateAdmin(this.props.review.admin_id,this.props.userId)}}>{this.props.review.admin_username}</h3>
        {/* <a className="u-linked"href={this.props.review.trailer_link} target="_blank">View Trailer</a> */}
        {this.props.admin === true && <Link to={`/edit_review/${this.props.review._id}`} className="u-linked">
          Edit Review
        </Link>}
        {this.props.root === true && <div onClick={()=>{this.props.delete_review(this.props.review._id)}}className='u-linked u-pointer'>Delete Review</div>}
        </div>
      </div>
    );
  }
}

export default SingleReview;
