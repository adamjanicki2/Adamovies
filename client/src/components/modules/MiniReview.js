import React, { Component } from "react";
import { navigate } from "@reach/router";
import "./MiniReview.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTv } from '@fortawesome/free-solid-svg-icons';

class MiniReview extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <div className="Mini-container u-textCenter Title-link">
        <div className='u-pointer' onClick={() => {navigate(`/review/${this.props.review._id}`)}}>
        <h1 className='mini-title'>{this.props.review.title} {this.props.review.season !== 0 && 'S'+this.props.review.season.toString()}{this.props.review.season !== 0 && this.props.review.episode !== 0 && 'E'+this.props.review.episode.toString()}</h1>
        <img src={this.props.review.img_url} className='Mini-img'/>
        <div className='movie-info'>
          <FontAwesomeIcon icon={this.props.review.type==='movie'? faFilm:faTv} size={'2x'}/>
          <h2 className='dot-spacing mini-subpicture'>•</h2>
          <h2 className='mini-subpicture'>{this.props.review.rating}%</h2>
        </div>
        </div>
      </div>
    );
  }
}

export default MiniReview;
