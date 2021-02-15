import React, { Component } from "react";
import "../../utilities.css";
import "./FAQ.css";
import logo from "../../public/img/black180.png";
import BottomBar from "../modules/BottomBar.js";
import { get } from "../../utilities.js";

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
        reviews: undefined,
        comments: undefined,
        announcements: undefined,
        users: undefined,
    };
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    document.title = 'Adamovies | Statistics';
    get('/api/num_reviews').then((all_reviews) => {
        this.setState({reviews: all_reviews})
    });
    get('/api/num_announcements').then((announcements) => {
        this.setState({announcements: announcements});
    });
    get('/api/num_comments').then((ments) => {
        this.setState({comments: ments});
    });
    get("/api/num_users").then((users) => {
        this.setState({users: users});
    });
  }

  render() {
    if (this.state.users === undefined || this.state.announcements === undefined || this.state.comments === undefined || this.state.reviews === undefined){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <h1 className='u-pageHeader u-textCenter'>Site Statistics</h1>   
        <div className='stats-container'>
        <ul>
            <li className='stats-text'>We have <span className='u-bold'>{this.state.users.total}</span> Registered users</li>
            <li className='stats-text'><span className='u-bold'>{this.state.users.admin}</span> of those users are admins</li>
            <li className='stats-text'>There are <span className='u-bold'>{this.state.reviews.total}</span> admin reviews</li>
            <li className='stats-text'>Adamovies users have left <span className='u-bold'>{this.state.comments.total}</span> comments</li>
            <li className='stats-text'>Reviews have received <span className='u-bold'>{this.state.reviews.likes}</span> total likes</li>
            <li className='stats-text'>The most liked review is <span className='u-bold'>{this.state.reviews.maxLikes.title+`${this.state.reviews.maxLikes.season !== 0? ` S${this.state.reviews.maxLikes.season}`+`${this.state.reviews.maxLikes.episode !== 0? `E${this.state.reviews.maxLikes.episode}` : ''}` : ''}`}</span> with <span className='u-bold'>{this.state.reviews.maxRating.likes}</span> likes</li>
            <li className='stats-text'>The most commented review is <span className='u-bold'>{this.state.comments.maxCommented.title+`${this.state.comments.maxCommented.season !== 0? ` S${this.state.comments.maxCommented.season}`+`${this.state.comments.maxCommented.episode !== 0? `E${this.state.comments.maxCommented.episode}` : ''}` : ''}`}</span> with <span className='u-bold'>{this.state.comments.maxAmount}</span> comments</li>
            <li className='stats-text'>The average review rating is <span className='u-bold'>{this.state.reviews.avg_rating}%</span></li>
            <li className='stats-text'><span className='u-bold'>{this.state.reviews.maxRating.title+`${this.state.reviews.maxRating.season !== 0? ` S${this.state.reviews.maxRating.season}`+`${this.state.reviews.maxRating.episode !== 0? `E${this.state.reviews.maxRating.episode}` : ''}` : ''}`}</span> is the highest rated review with a <span className='u-bold'>{this.state.reviews.maxRating.rating}%</span></li>
            <li className='stats-text'><span className='u-bold'>{this.state.reviews.minRating.title+`${this.state.reviews.minRating.season !== 0? ` S${this.state.reviews.minRating.season}`+`${this.state.reviews.minRating.episode !== 0? `E${this.state.reviews.minRating.episode}` : ''}` : ''}`}</span> is the lowest rated review with a <span className='u-bold'>{this.state.reviews.minRating.rating}%</span></li>
            <li className='stats-text'>Admins have posted <span className='u-bold'>{this.state.announcements.total}</span> announcements</li>
        </ul>

        <div className="centered-elements Adamovies-logo180"><img className="Adamovies-logo180bordering" src={logo}/></div>
        </div>
        <BottomBar/>  
      </div>
    );
  }
}

export default Stats;
