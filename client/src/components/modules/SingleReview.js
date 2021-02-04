import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import "./SingleReview.css";
import { convertDate } from "../../utilities.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faHeart } from '@fortawesome/free-solid-svg-icons';
class SingleReview extends Component {
  constructor(props) {
    super(props);
    //this.props.userId
  }


  render() {
    console.log('rendered soingle review');
    const heart_style = this.props.unliked? 'grey-heart': 'card-heart';
    return (
      <div className="Review-container u-textCenter Title-link">
        <div className='u-pointer' onClick={() => {navigate(`/review/${this.props.review._id}`)}}>
        <h1>{this.props.review.title} ({this.props.review.release_year})</h1>
        {this.props.review.season !== 0 && <h2>Season {this.props.review.season} {this.props.review.episode !== 0? `Episode ${this.props.review.episode}` : ""}</h2>}
        <img src={this.props.review.img_url} className='Poster-img'/>
        <div className='movie-info'><h2>{convertDate(this.props.review.timestamp).split(' ')[0]}</h2><h2 className='bar-spacing'>|</h2><h2>{this.props.review.rating}%</h2><h2 className='bar-spacing'>|</h2><FontAwesomeIcon className={heart_style} icon={faHeart} size={'2x'}/><h2>{this.props.review.likes}</h2></div>
        </div>
        <div className='Review-linkcontainer'>
        <Link to={`/review/${this.props.review._id}`} className="u-linked">
            Read {this.props.review.admin_username}'s Review
        </Link>
        <a className="u-linked"href={this.props.review.trailer_link} target="_blank">View Trailer</a>
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
