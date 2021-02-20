import React, { Component } from "react";
import { get, convertDate, post, convertPicture } from "../../utilities.js";
import { socket } from "../../client-socket.js";
import "../../utilities.css";
import "./ReviewPage.css";
import "../modules/SingleReview.css";
import { NewComment } from "../modules/NewInput.js";
import SingleComment from "../modules/SingleComment.js";
import { navigate } from "@reach/router";
import BottomBar from "../modules/BottomBar.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft, faHeart, faComment, faTv, faFilm } from '@fortawesome/free-solid-svg-icons';
class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: undefined,
      comments: undefined,
      user: undefined,
      liked_review: undefined,
    };
  }

  componentDidMount() {
    get(`/api/get_single_review`, { movieId: this.props.movieId }).then((movie) => {
      get('/api/get_comments_for_review', { review_id: movie._id}).then((comments) => {
        let se = movie.season === 0? '': 'S'+movie.season.toString();
        if (movie.episode !== 0){
          se+='E'+movie.episode.toString();
        }
        document.title = movie.title +' '+se+ " ("+movie.release_year+") | Adamovies";
        // console.log(movie);
        this.setState({review: movie, comments: comments, liked_review: movie.liked_users.includes(this.props.userId)});
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

  convertRuntime = (minutes) => {
    const hours = Math.floor(minutes/60);
    const mini = minutes % 60;
    const hours_str = hours === 0? '' : hours.toString()+'h';
    return hours_str + mini.toString()+'m';
  };

  handleDeletion = (commentId) => {
    post("/api/delete_comment", {comment_id: commentId}).then((success) => {
      get("/api/get_comments_for_review", {review_id: this.props.movieId}).then((comments) =>{
        this.setState({comments: comments});
      })
    })
  };
  
  likeReview = (review_id, has_liked, user_id) => {
    //req.body.current_user_list, req.body.new_likes
    if (!has_liked && user_id){
      post("/api/like_review", {review_id: review_id, current_user_list: this.state.review.liked_users, new_likes: this.state.review.likes+1}).then((success) => {
        let review_copy = this.state.review;
        review_copy.likes = this.state.review.likes+1;
        this.setState({liked_review: true, review: review_copy});
      });
    }
  };

  render() {
    if (!this.state.review) {
        return <div></div>;
    }
    const comments_list = this.state.comments && this.state.comments.length > 0? this.state.comments.map((comment) => 
        <div className="comment-single"><SingleComment self_username={this.props.username} self_id={this.props.userId} admin={this.props.admin} root={this.props.root} commentId={comment._id} handleDeletion={this.handleDeletion} timestamp={comment.timestamp} userId={comment.user_id} commenter={comment.username} picture={comment.picture} content={comment.content} color={this.props.userId === comment.user_id? 'Self-background' : 'Normal-background'}/></div>
    ) : <div>No comments on this review!</div>
    return (
      <>
      <div className='back-container' onClick={()=>{history.back()}}><FontAwesomeIcon icon={faChevronLeft} size={'2x'}/><h2 className='no-margin'>Back</h2></div>
      <div className="review-containercontainer">
      <div className='review-container'>
        <div className='u-textCenter'>
            <div className='title-container'><h1 className='u-pageHeaderInter'>{this.state.review.title} ({this.state.review.release_year})</h1></div>
            {this.state.review.season !== 0 && <h1>Season {this.state.review.season} {this.state.review.episode!==0 && ' Episode '+this.state.review.episode}</h1>}
            <h1>{this.state.review.rating}%</h1>
            <img src={this.state.review.img_url} className='Poster-img'/>
            <div className='movie-info-page'>
              <FontAwesomeIcon className='media-icon' icon={this.state.review.type==='movie'? faFilm:faTv} size={'2x'}/>
              <h2 className='marginsubtext'>•</h2>
              <h2 className='marginsubtext'>{this.state.review.genre+' '}</h2>
              <h2 className='marginsubtext'>•</h2>
              <h2 className='marginsubtext'>{this.state.review.director} </h2>
              <h2 className='marginsubtext'>•</h2>
              <h2 className='marginsubtext'>{this.state.review.mpa_rating} </h2>
              {this.state.review.runtime !==0 &&<h2 className='marginsubtext'>•</h2>}
              {this.state.review.runtime !==0 && <h2 className='marginsubtext'>{this.convertRuntime(this.state.review.runtime)}</h2>}
              
            </div>
            <div><a className="u-linked" href={this.state.review.trailer_link} target="_blank">View Trailer</a> {this.props.root && <a className="u-linked u-pointer" onClick={()=>{navigate(`/edit_review/${this.state.review._id}`)}}>Edit Review</a>}</div>
        </div>
        <hr className='review-line'/>
        
            <div className="Review-headercontainer">
              <div className='review-titleentry'><h1 className='Review-subTitle'>{convertDate(this.state.review.timestamp)}</h1></div>
              <div className='review-titleentry review-title-namepfp'><img className='admin-review-pfp'src={convertPicture('36', this.state.review.admin_picture)}/><h1 className='Review-subTitle admin-name' onClick={() => {this.navigateProfile(this.state.review.admin_id, this.props.userId)}}>{this.state.review.admin_username}</h1></div>
              <div className='review-titleentry'><h1 className='Review-subTitle'>Adameter: {this.state.review.rating}%</h1></div>
            </div>
            <div className='like-container'><FontAwesomeIcon icon={faHeart} size={'2x'} className={this.state.liked_review || !this.props.userId? "liked-heart" : 'unliked-heart'} onClick={()=>{this.likeReview(this.state.review._id, this.state.liked_review, this.props.userId)}}/><h2 className='likes-text'>{this.state.review.likes}</h2></div>
            <h2 className='no-top'>Review: </h2>
            
        <p className='review-content'>
            {this.state.review.content.map((paragraph) => <div>{paragraph}<br></br></div>)}
        </p>
        <hr className='review-line'/>
        <div>
          <div className='comment-bubble'><FontAwesomeIcon className='comment-icon-reviewpage' icon={faComment} size={'2x'}/><h2 className='likes-text'>{this.state.comments.length}</h2></div>
            {(this.props.userId && this.props.user_can_comment === true) && <div className="Comment-bar"><NewComment movieId={this.state.review._id} title={this.state.review.title}className='Comment-bar'/></div>}
            {this.props.user_can_comment === false && <h3>Your comment permissions have been revoked!</h3>}
            {comments_list}
        </div>
        </div>
        </div>
        <BottomBar/>
      </>
    );
  }
}

export default ReviewPage;
