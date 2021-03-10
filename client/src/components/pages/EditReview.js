import React, { Component } from "react";
import "../../utilities.css";
import "./PostReview.css";
import { get, post } from "../../utilities.js";
import { navigate } from '@reach/router';
import BottomBar from "../modules/BottomBar.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faChevronLeft } from '@fortawesome/free-solid-svg-icons';
class EditReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      title: '',
      media_type: '',
      season: undefined,
      episode: undefined,
      rating: undefined,
      director: '',
      review_content: '',
      img_url: '',
      trailer_link: '',
      release_year: undefined,
      runtime: undefined,
      mpa_rating: '',
      genre: '',
    };
  }

  componentDidMount() {
    document.title = "Edit Review | Adamovies";
    get("/api/get_single_review", {movieId: this.props.reviewId}).then((single_review) => {
      const newState = {
        title: single_review.title,
        media_type: single_review.type,
        season: single_review.season,
        episode: single_review.episode,
        rating: single_review.rating,
        director: single_review.director,
        review_content: single_review.content.join('\n'),
        img_url: single_review.img_url,
        trailer_link: single_review.trailer_link,
        release_year: single_review.release_year,
        runtime: single_review.runtime,
        mpa_rating: single_review.mpa_rating,
        genre: single_review.genre,
      };
      this.setState(newState);
    });
    get("/api/whoami").then((user_) => {
      this.setState({user: user_});
    })
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  checkFilled = () => {
    return (this.state.media_type==='movie' && (this.state.runtime===undefined || this.state.runtime===null || this.state.runtime==='')) || this.state.title==='' || this.state.genre==='' || this.state.media_type==='' || this.state.director==='' || this.state.review_content==='' || this.state.rating===null ||this.state.rating===undefined||this.state.rating==='' || this.state.img_url==='' || this.state.mpa_rating==='' || this.state.trailer_link==='' || this.state.release_year===undefined || this.state.release_year===null || this.state.release_year==='';
  };

  handleSubmit = () => {
    if (this.checkFilled()) {
      window.alert("Fill in all fields!")
    }else{
      // console.log(this.state.review_content.split('\n'));
      if (window.confirm("Click OK to submit your edited review!")){
        const body = {
          review_id: this.props.reviewId,
          release_year: this.state.release_year,
          title: this.state.title,
          rating: this.state.rating,
          director: this.state.director,
          content: this.state.review_content.split('\n'),
          img_url: this.state.img_url,
          trailer_link: this.state.trailer_link,
          season: this.state.season? this.state.season : 0,
          episode: this.state.episode? this.state.episode : 0,
          runtime: this.state.runtime? this.state.runtime : 0,
          mpa_rating: this.state.mpa_rating,
          genre: this.state.genre,
        };
    
        post('/api/update_review', body).then((response) => {
          navigate("/");
        });
      }
    }
  };



  render() {
    if (!this.state.user || !this.state.user.admin){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <div className='back-container' onClick={()=>{history.back()}}><FontAwesomeIcon icon={faChevronLeft} size={'2x'}/><h2 className='no-margin'>Back</h2></div>
        <h1 className='u-pageHeaderInter u-textCenter'>Edit Review page for "{this.state.title}"</h1>
        {this.state.media_type !== '' && <div className='Post-container'>
          <div className="Entry-flex">
            <h2 className='field-text'>Title</h2>
            <input 
            type="text"
            name='title'
            required={true}
            placeholder={this.state.media_type === "movie"? "Inception" : "The Mandalorian"}
            value={this.state.title}
            onChange={this.handleChange}
            className="Review-input"
            maxLength="40"
          />
          </div>
          {this.state.media_type === 'show' && <div className="Entry-flex">
            <h2 className='field-text'>Season</h2>
            <input 
            type="number"
            name='season'
            value={this.state.season}
            onChange={this.handleChange}
            className="Review-input"
            min="0" max="100"
            placeholder='0'
          />
          </div>}
          {this.state.media_type === 'show' && <div className="Entry-flex">
            <h2 className='field-text'>Episode</h2>
            <input 
            type="number"
            name='episode'
            value={this.state.episode}
            onChange={this.handleChange}
            className="Review-input"
            min="0" max="100"
            placeholder='0'
          />
          </div>}
          {this.state.media_type === 'movie' && <div className="Entry-flex">
            <h2 className='field-text'>Runtime</h2>
            <input 
            type="number"
            name='runtime'
            value={this.state.runtime}
            onChange={this.handleChange}
            className="Review-input"
            min="0" max="300"
            placeholder='169'
          />
          </div>}
          <div className="Entry-flex">
            <h2 className='field-text'>Rating</h2>
            <input
            name='rating'
            required={true}
            type="number"
            value={this.state.rating}
            onChange={this.handleChange}
            className="Review-input"
            min="0" max="100"
            placeholder='97'
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>MPAA Rating</h2>
            <input
            name='mpa_rating'
            required={true}
            type="text"
            value={this.state.mpa_rating}
            onChange={this.handleChange}
            className="Review-input"
            maxLength='5'
            placeholder={this.state.media_type === 'movie'? "PG-13" : "TV-14"}
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>Release Year</h2>
            <input
            name='release_year'
            required={true}
            type="number"
            value={this.state.release_year}
            onChange={this.handleChange}
            className="Review-input"
            min="0" max="2100"
            placeholder={this.state.media_type === 'movie'? "1993" : "2015"}
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>Director</h2>
            <input
            name='director'
            required={true}
            type="text"
            value={this.state.director}
            onChange={this.handleChange}
            className="Review-input"
            maxLength='40'
            placeholder={this.state.media_type === 'movie'? "Mary Harron" : "Sam Esmail"}
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>Genre</h2>
            <input
            name='genre'
            required={true}
            type="text"
            value={this.state.genre}
            onChange={this.handleChange}
            className="Review-input"
            maxLength='20'
            placeholder={this.state.media_type === 'movie'? "Action/Sci-fi" : "Crime/Drama"}
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>Image URL</h2>
            <input
            name='img_url'
            required={true}
            type="text"
            value={this.state.img_url}
            onChange={this.handleChange}
            className="Review-input"
            maxLength='500'
            placeholder="https://url.com/pic.jpg"
          />
          </div>
          <div className="Entry-flex">
            <h2 className='field-text'>Trailer Link</h2>
            <input
            name='trailer_link'
            required={true}
            type="text"
            value={this.state.trailer_link}
            onChange={this.handleChange}
            className="Review-input"
            maxLength='200'
            placeholder='https://youtube.com/...'
          />
          </div>
          <div className='Review-flex'>
            <h2 className='field-text'>Review</h2>
            <textarea
            name='review_content'
            required={true}
            maxLength='10000'
            value={this.state.review_content}
            className="Content-input"
            placeholder="Edit your review here!"
            onChange={this.handleChange}
            rows='16'
            />
          </div>
          {this.state.media_type !== '' && <div className='centered-elements post-submit'><button
          type="submit"
          className="Submit-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit Review
        </button></div>}
        </div>}
        <BottomBar/>
      </div>
    );
  }
}

export default EditReview;
