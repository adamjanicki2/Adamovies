import React, { Component } from "react";
import { get, post } from "../../utilities.js";
import "../../utilities.css";
import "./Reviews.css";
import "./Home.css";
import SingleReview from "../modules/SingleReview.js";
import { SearchBar } from "../modules/NewInput.js";
import BottomBar from "../modules/BottomBar.js";
class Shows extends Component {
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
    document.title = "Adamovies | TV Shows";
    get("/api/get_reviews", {type: 'show'}).then((reviews) => {
      this.setState({reviews: reviews, reviews_to_display: [...reviews],});
    });
  }

  delete_review = (review_id) => {
    if (window.confirm("Click OK to delete this review")){
      post("/api/delete_review", {review_id: review_id}).then((deleted) => {
        get("/api/get_reviews", {type: 'show'}).then((reviews) => {
          this.setState({reviews: reviews, reviews_to_display: this.sortReviews(reviews, this.state.sort_option)});
        });
      });
    }
  };

  sortReviews = (reviews, newSort) => {
    if (newSort === 'all' || newSort === 'publishedlowtohigh'){
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
    else if (newSort === 'alphabetically'){
      return [...reviews].sort((a, b) => a.title > b.title? 1: -1);
    }
  };

  updateQuery = (newQuery) => {
    const lower = newQuery.toLowerCase();
    const newReviews_list = lower === '' || lower === 'all'? [...this.state.reviews] : 
    this.state.reviews.filter(review => 
      review.title.toLowerCase() === lower ||
      review.title.toLowerCase().split(' ').includes(lower) ||
      review.director.toLowerCase() === lower ||
      review.director.toLowerCase().split(' ').includes(lower) ||
      review.release_year.toString() === newQuery ||
      review.admin_username.toLowerCase() === lower);
    this.setState({reviews_to_display: this.sortReviews(newReviews_list, this.state.sort_option)});
  };

  updateSorted = (newSort) => {
    if (newSort === this.state.sort_option){
      return
    }
    let updatedSort = null;
    if (newSort === 'all' || newSort === 'publishedlowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.timestamp > b.timestamp? 1: -1);
    }else if (newSort === 'publishedhightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.timestamp > b.timestamp? -1: 1);
    }
    else if (newSort === 'releaselowtohigh'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.release_year > b.release_year? 1: -1);
    }
    else if (newSort === 'releasehightolow'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.release_year > b.release_year? -1: 1);
    }
    else if (newSort === 'alphabetically'){
      updatedSort = this.state.reviews_to_display.sort((a, b) => a.title > b.title? 1: -1);
    }
    this.setState({reviews_to_display: updatedSort});
  };

  handleChangeSorted = (event) => {
    this.updateSorted(event.target.value);
    this.setState({sort_option: event.target.value});
  }

  onSearchSubmit = (searchQuery) => {
    this.updateQuery(searchQuery);
    console.log('Searched: '+searchQuery);
  };

  render() {
    if(this.state.reviews === undefined){
      return (<div></div>);
    }
    const reviews_list = this.state.reviews_to_display.length !== 0? this.state.reviews_to_display.map((review) => 
      <SingleReview review={review} admin={this.props.admin} root={this.props.root} delete_review={this.delete_review}/>
    ) : <h1 className='u-textCenter No-reviews'>No Reviews!</h1>;
    return (
      <>
      <div className='bg'>
        <h1 className="u-pageHeader">TV Shows</h1>
        <div className='centered-elements'><SearchBar defaultText={'Search by title, director, year, or admin'} onSubmit={this.onSearchSubmit}/></div>
        <div className="centered-elements inputs-top"><select name='sorted_type' className='dropdown-filter' onChange={this.handleChangeSorted}>
          <option value="publishedlowtohigh" selected>Sort By: Published Low to High</option>
          <option value="publishedhightolow">Sort By: Published High to Low</option>
          <option value="releaselowtohigh">Sort By: Release Low to High</option>
          <option value="releasehightolow">Sort By: Release High to Low</option>
          <option value="alphabetically">Sort By: Title</option>

        </select></div>
        <div className={this.state.reviews_to_display.length !== 0? "reviews-container" : 'No-reviews'}>{reviews_list}</div>
        <BottomBar />
      </div>
      </>
    );
  }
}
export default Shows;
