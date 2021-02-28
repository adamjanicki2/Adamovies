import React, { Component } from "react";
import { get, post } from "../../utilities.js";
import "../../utilities.css";
import "./Reviews.css";
import "./Home.css";
import SingleReview from "../modules/SingleReview.js";
import { SearchBar } from "../modules/NewInput.js";
import BottomBar from "../modules/BottomBar.js";

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: undefined,
      reviews_to_display: undefined,
      query: undefined,
      sort_option: 'all',
    };
  }

  componentDidMount() {
    document.title = this.props.type === 'movie'? 'Movies | Adamovies' : 'TV Shows | Adamovies';
    get("/api/get_reviews", {type: this.props.type}).then((reviews) => {
      this.setState({reviews: reviews, reviews_to_display: [...reviews],});
    });
  }

  delete_review = (review_id) => {
    if (window.confirm("Click OK to delete this review")){
      post("/api/delete_review", {review_id: review_id}).then((deleted) => {
        get("/api/get_reviews", {type: this.props.type}).then((reviews) => {
          this.setState({reviews: reviews, reviews_to_display: this.sortReviews(reviews, this.state.sort_option)});
        });
      });
    }
  };

  sortReviews = (reviews, newSort) => {
    if (newSort === 'all' || newSort === 'alphabetically'){
      return [...reviews];
    }else if (newSort === 'publishedhightolow'){
      return [...reviews].sort((a, b) => a.timestamp > b.timestamp? -1: 1);
    }
    else if (newSort === 'releaselowtohigh'){
      return [...reviews].sort((a, b) => a.release_year > b.release_year? 1: -1);
    }
    else if (newSort === 'releasehightolow'){
      return [...reviews].sort((a, b) => a.release_year > b.release_year? -1: 1);
    }
    else if (newSort === 'publishedlowtohigh'){
      return [...reviews].sort((a, b) => a.timestamp > b.timestamp? 1: -1);
    }
    else if (newSort === 'reversealphabetically'){
      return [...reviews].sort((a, b) => a.title > b.title? -1: 1);
    }
    else if (newSort === 'ratinglowtohigh'){
      return [...reviews].sort((a, b) => a.rating > b.rating? 1: -1);
    }
    else if (newSort === 'ratinghightolow'){
      return [...reviews].sort((a, b) => a.rating > b.rating? -1: 1);
    }
    else if (newSort === 'likeslowtohigh'){
      return [...reviews].sort((a, b) => a.likes > b.likes? 1: -1);
    }
    else if (newSort === 'likeshightolow'){
      return [...reviews].sort((a, b) => a.likes > b.likes? -1: 1);
    }
  };

  updateQuery = (newQuery) => {
    const replacements = /[:,.?!&+%@-]/g;
    const lower = newQuery.toLowerCase();
    const noSpaces = newQuery.toLowerCase().replace(" ", "");
    const noJunk = newQuery.toLowerCase().replace(replacements, "");
    const noBoth = newQuery.toLowerCase().replace(replacements, "").replace(" ", "");
    const checkArr = [noSpaces, lower, noJunk, noBoth];
    const newReviews_list = lower === '' || lower === 'all'? [...this.state.reviews] : 
    this.state.reviews.filter(review => 
      checkArr.includes(review.title.toLowerCase()) ||
      review.title.toLowerCase().split(' ').includes(lower) ||
      review.title.toLowerCase().split(' ').includes(noSpaces) ||
      review.title.toLowerCase().split(' ').includes(noJunk) ||
      review.title.toLowerCase().split(' ').includes(noBoth) ||
      review.title.toLowerCase().replace(replacements, "").split(' ').includes(lower) ||
      review.title.toLowerCase().replace(replacements, "").split(' ').includes(noSpaces) ||
      review.title.toLowerCase().replace(replacements, "").split(' ').includes(noJunk) ||
      review.title.toLowerCase().replace(replacements, "").split(' ').includes(noBoth) ||
      checkArr.includes(review.director.toLowerCase()) ||
      review.director.toLowerCase().split(' ').includes(lower) ||
      review.director.toLowerCase().split(' ').includes(noSpaces) ||
      review.director.toLowerCase().split(' ').includes(noJunk) ||
      review.director.toLowerCase().split(' ').includes(noBoth) ||
      checkArr.includes(review.mpa_rating) ||
      checkArr.includes(review.release_year.toString()) ||
      review.genre.toLowerCase().split('/').includes(lower) ||
      review.genre.toLowerCase().split('/').includes(noSpaces) ||
      review.genre.toLowerCase().split('/').includes(noJunk) ||
      review.genre.toLowerCase().split('/').includes(noBoth) ||
      checkArr.includes(review.rating.toString()) ||
      checkArr.includes(review.admin_username.toLowerCase()));
    this.setState({reviews_to_display: this.sortReviews(newReviews_list, this.state.sort_option)});
  };

  updateSorted = (newSort) => {
    if (newSort === this.state.sort_option){
      return
    }
    let updatedSort = null;
    if (newSort === 'all' || newSort === 'alphabetically'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.title > b.title? 1: -1);
    }else if (newSort === 'publishedhightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.timestamp > b.timestamp? -1: 1);
    }
    else if (newSort === 'releaselowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.release_year > b.release_year? 1: -1);
    }
    else if (newSort === 'releasehightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.release_year > b.release_year? -1: 1);
    }
    else if (newSort === 'publishedlowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.timestamp > b.timestamp? 1: -1);
    }
    else if (newSort === 'reversealphabetically'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.title > b.title? -1: 1);
    }
    else if (newSort === 'ratinglowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.rating > b.rating? 1: -1);
    }
    else if (newSort === 'ratinghightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.rating > b.rating? -1: 1);
    }
    else if (newSort === 'likeslowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.likes > b.likes? 1: -1);
    }
    else if (newSort === 'likeshightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.likes > b.likes? -1: 1);
    }
    this.setState({reviews_to_display: updatedSort});
  };

  handleChangeSorted = (event) => {
    this.updateSorted(event.target.value);
    this.setState({sort_option: event.target.value});
  }

  onSearchSubmit = (searchQuery) => {
    this.updateQuery(searchQuery);
    // console.log('Searched: '+searchQuery);
  };

  render() {
    if(this.state.reviews === undefined){
      return (<div></div>);
    }
    const reviews_list = this.state.reviews_to_display.length !== 0? this.state.reviews_to_display.map((review) => 
      <SingleReview review={review} admin={this.props.admin} root={this.props.root} delete_review={this.delete_review} unliked={this.props.userId && !review.liked_users.includes(this.props.userId)} userId={this.props.userId}/>
    ) : <h1 className='u-textCenter No-reviews'>No Reviews!</h1>;
    return (
      <>
      <div className='bg'>
        <h1 className="u-pageHeader">{this.props.type === 'movie'? 'Movies' : 'Shows'}</h1>
        <div className='centered-elements'><SearchBar defaultText={'Search by title, director, year, genre, MPAA rating, or admin'} onSubmit={this.onSearchSubmit}/></div>
        <div className="centered-elements inputs-top"><select name='sorted_type' className='dropdown-filter' onChange={this.handleChangeSorted}>
          <option value="alphabetically" selected>Sort By: Title (Alphabetically)</option>
          <option value="reversealphabetically">Sort By: Title (Reverse Alphabetically)</option>
          <option value="ratinglowtohigh">Sort By: Rating (Low to High)</option>
          <option value="ratinghightolow">Sort By: Rating (High to Low)</option>
          <option value="likeslowtohigh">Sort By: Likes (Low to High)</option>
          <option value="likeshightolow">Sort By: Likes (High to Low)</option>
          <option value="publishedlowtohigh">Sort By: Published (Old to New)</option>
          <option value="publishedhightolow">Sort By: Published (New to Old)</option>
          <option value="releaselowtohigh">Sort By: Release (Old to New)</option>
          <option value="releasehightolow">Sort By: Release (New to Old)</option>
          
          

        </select></div>
        <div className={this.state.reviews_to_display.length !== 0? "reviews-container" : 'No-reviews'}>{reviews_list}</div>
        <BottomBar />
      </div>
      </>
    );
  }
}
export default Reviews;
