import React, { Component } from "react";
import { get, convertDate, post } from "../../utilities.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./ReviewPage.css";
import "../modules/SingleReview.css";
import { NewComment } from "../modules/NewInput.js";
import SingleComment from "../modules/SingleComment.js";
import { navigate } from "@reach/router";

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
        document.title = "Adamovies | "+movie.title + " ("+movie.release_year+")"
          this.setState({review: movie, comments: comments});
      });
    });
    socket.on(this.props.movieId, (data) => {
      this.setState((previous_state) => ({
        comments: previous_state.comments.concat(data),
      }));
    });
  }
  navigateProfile = (admin_id, self_id) => {
    if (admin_id === self_id){
      navigate("/myprofile");
    }else{
      navigate(`/user/${admin_id}`);
    }
  };

  handleDeletion = (commentId) => {
    post("/api/delete_comment", {comment_id: commentId}).then((success) => {
      get("/api/get_comments_for_review", {review_id: this.props.movieId}).then((comments) =>{
        this.setState({comments: comments});
      })
    })
  };

  render() {
    if (!this.state.review) {
        return <div></div>;
    }
    const comments_list = this.state.comments && this.state.comments.length > 0? this.state.comments.map((comment) => 
        <div className="comment-single"><SingleComment self_id={this.props.userId} admin={this.props.admin} root={this.props.root} commentId={comment._id} handleDeletion={this.handleDeletion} timestamp={comment.timestamp} userId={comment.user_id} commenter={comment.username} picture={comment.picture} content={comment.content} color={this.props.userId === comment.user_id? 'Self-background' : 'Normal-background'}/></div>
    ) : <div>No comments on this review!</div>
    return (
      <>
        <div className='u-textCenter'>
            <h1>{this.state.review.title} ({this.state.review.release_year})</h1>
            <h1>{this.state.review.rating}%</h1>
            <img src={this.state.review.img_url} className='Poster-img'/>
            <h2>Director: {this.state.review.director}</h2>
            <a className="u-linked" href={this.state.review.trailer_link} target="_blank">View Trailer</a>
        </div>
        <div className="review-containercontainer">
        <div className='review-container'>
            <div className="Review-headercontainer">
              <div className='review-titleentry'><h1 className='Review-subTitle'>{convertDate(this.state.review.timestamp)}</h1></div>
              <div className='review-titleentry'><h1 className='Review-subTitle admin-name' onClick={() => {this.navigateProfile(this.state.review.admin_id, this.props.userId)}}>{this.state.review.admin_username}</h1></div>
              <div className='review-titleentry'><h1 className='Review-subTitle'>Adameter: {this.state.review.rating}%</h1></div>
            </div>
            <h2>Review: </h2>
            
        <p className='review-content'>
            {this.state.review.content}
        </p>
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
