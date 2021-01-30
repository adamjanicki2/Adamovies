import React, { Component } from "react";
import { Link } from "@reach/router";
import "./SingleReview.css";

class SingleReview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Review-container u-textCenter">
        <h1>{this.props.review.title} ({this.props.review.release_year})</h1>
        <img src={this.props.review.img_url} className='Poster-img'/>
        <h2>Director: {this.props.review.director}</h2>
        <h2>Score: {this.props.review.rating}%</h2>
        <Link to={`/review/${this.props.review._id}`}>
            Read Review
        </Link>
        <div></div>
        <a href={this.props.review.trailer_link} target="_blank">Trailer Link</a>
      </div>
    );
  }
}

export default SingleReview;
