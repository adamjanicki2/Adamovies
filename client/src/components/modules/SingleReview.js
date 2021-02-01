import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import "./SingleReview.css";
import { convertDate } from "../../utilities.js";
class SingleReview extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="Review-container u-textCenter">
        <h1 className='Title-link' onClick={() => {navigate(`/review/${this.props.review._id}`)}}>{this.props.review.title} ({this.props.review.release_year})</h1>
        {this.props.review.season !== 0 && <h2>Season {this.props.review.season} {this.props.review.episode !== 0? `Episode ${this.props.review.episode}` : ""}</h2>}
        <img src={this.props.review.img_url} className='Poster-img'/>
        <h2>{convertDate(this.props.review.timestamp).split(' ')[0]} | {this.props.review.rating}%</h2>
        {this.props.admin === true && <Link to={`/edit_review/${this.props.review._id}`} className="u-linked">
          Edit Review
        </Link>}
        <Link to={`/review/${this.props.review._id}`} className="u-linked">
            Read {this.props.review.admin_username}'s Review
        </Link>
        <div></div>
        <a className="u-linked"href={this.props.review.trailer_link} target="_blank">View Trailer</a>
      </div>
    );
  }
}

export default SingleReview;
