import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";
import SingleReview from "../modules/SingleReview.js";
import { get, post } from "../../utilities.js";
import BottomBar from '../modules/BottomBar.js';
import Announcements from "../modules/Announcements.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recent_reviews: undefined,
      recent_announcements: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Adamovies';
    get("/api/recent_reviews").then((reviews) => {
      this.setState({recent_reviews: reviews});
    });
    get("/api/recent_announcements").then((announcements) => {
      this.setState({recent_announcements: announcements});
    })
  }

  delete_review = (review_id) => {
    if (window.confirm("Click OK to delete this review")){
      post("/api/delete_review", {review_id: review_id}).then((deleted) => {
        get("/api/recent_reviews").then((reviews) => {
          this.setState({recent_reviews: reviews});
        });
      });
    }
  };

  onSubmit = (title, content) => {
    if (window.confirm('Click OK to Submit Announcement')){
        const newAnnouncement = {
          title: title,
          content: content,
        };
        post("/api/new_announcement", {title: title, content: content}).then((new_announcement) => {
          let new_recent = [new_announcement].concat(this.state.recent_announcements);
          this.setState((previous_state) => ({
            recent_announcements: [new_announcement].concat(previous_state.recent_announcements),
          }));
        });
    }
  }

  render() {
    if (this.state.recent_reviews === undefined || this.state.recent_announcements === undefined){
      return (<div></div>);
    }
    const reviews_list = this.state.recent_reviews.length !== 0? this.state.recent_reviews.map((review) => 
      <SingleReview review={review} admin={this.props.admin} root={this.props.root} delete_review={this.delete_review} unliked={this.props.userId && !review.liked_users.includes(this.props.userId)}/>
    ) : <div className='u-textCenter'>No Recent Reviews!</div>;
    return (
      <>
      <div className='bg'>
        <h1 className="u-pageHeader">Announcements</h1>
        <Announcements recent_announcements={this.state.recent_announcements} self_id={this.props.userId} admin={this.props.admin} onSubmit={this.onSubmit}/>
        <h1 className="u-pageHeader">Recent Reviews</h1>
        <div className='Reviews-container'>
          {reviews_list}
        </div>
        <BottomBar />
      </div>
      </>
    );
  }
}
export default Home;
