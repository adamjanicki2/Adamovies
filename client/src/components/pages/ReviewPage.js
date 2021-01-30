import React, { Component } from "react";
import { get } from "../../utilities.js";
import { socket } from "../../client-socket.js";
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
      user: undefined,
    };
  }

  componentDidMount() {
    
    get(`/api/get_single_review`, { movieId: this.props.movieId }).then((movie) => {
      get('/api/get_comments_for_review', { review_id: movie._id}).then((comments) => {
          this.setState({review: movie, comments: comments});
      });
    });
    socket.on(this.props.movieId, (data) => {
      this.setState((previous_state) => ({
        comments: previous_state.comments.concat(data),
      }));
    });
  }

  render() {
    if (!this.state.review) {
        return <div></div>;
    }
    const comments_list = this.state.comments && this.state.comments.length > 0? this.state.comments.map((comment) => 
        <div className={this.props.userId === comment.user_id? 'my-comment' : ''}><SingleComment userId={comment.user_id} commenter={comment.username} picture={comment.picture} content={comment.content} color={this.props.userId === comment.user_id? 'Self-background' : 'Normal-background'}/></div>
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
        <hr className='review-line'/>
        <div>
            <h2>Comments:</h2>
            {this.props.userId? <div className="Comment-bar"><NewComment movieId={this.state.review._id} className='Comment-bar'/></div> : <div></div>}
            {comments_list}
        </div>
        </div>
        </div>
      </>
    );
  }
}

export default ReviewPage;
