import React, { Component } from "react";
import { get } from "../../utilities.js";

import "../../utilities.css";
import "./ReviewPage.css";
import "../modules/SingleReview.css";
import { NewComment } from "../modules/NewInput.js";
import SingleComment from "../modules/SingleComment.js";

class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: undefined,
      comments: undefined,
    };
  }

  componentDidMount() {
    console.log(this.props.userId);
    get(`/api/get_single_review`, { movieId: this.props.movieId }).then((movie) => {
        this.setState({ review: movie});
        get('/api/get_comments_for_review', { review_id: movie._id}).then((comments) => {
            this.setState({review: movie, comments: comments});
        });
    });
  }

  addNewComment = (newComment) => {
    this.setState({
      comments: this.state.comments.concat([newComment]),
    });
  };

  render() {
    if (!this.state.review) {
        return <div></div>;
    }
    const comments_list = this.state.comments && this.state.comments.length > 0? this.state.comments.map((comment) => 
        <div><SingleComment commenter={comment.user_name} content={comment.content} color={this.props.userId === comment.user_id? 'Self-background' : 'Normal-background'}/></div>
    ) : <div>No comments on this review!</div>
    return (
      <>
        <div className='u-textCenter'>
            <h1>{this.state.review.title} ({this.state.review.release_year})</h1>
            <h1>{this.state.review.rating}%</h1>
            <img src={this.state.review.img_url} className='Poster-img'/>
            <h2>Director: {this.state.review.director}</h2>
            <a href={this.state.review.trailer_link} target="_blank">Trailer Link</a>
        </div>
        <div className="review-containercontainer">
        <div className='review-container'>
        <h2>Review:</h2>
        <div className='review-content'>
            {this.state.review.content}
        </div>
        <hr/>
        <div>
            <h2>Comments:</h2>
            {this.props.userId? <div className="Comment-bar"><NewComment addNewComment={this.addNewComment} movieId={this.state.review._id} className='Comment-bar'/></div> : <div></div>}
            {comments_list}
        </div>
        </div>
        </div>
      </>
    );
  }
}

export default ReviewPage;
