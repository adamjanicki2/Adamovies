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
        <h1>{this.props.review.title} ({this.props.review.release_year})</h1>
        <img src={this.props.review.img_url} className='Poster-img'/>
        <h2>{convertDate(this.props.review.timestamp).split(' ')[0]} | {this.props.review.admin_username} | {this.props.review.rating}%</h2>
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
