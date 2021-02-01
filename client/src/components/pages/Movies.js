import React, { Component } from "react";
import { get } from "../../utilities.js";
import "../../utilities.css";
import "./Reviews.css";
import "./Home.css";
import SingleReview from "../modules/SingleReview.js";
class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
    };
  }

  componentDidMount() {
    document.title = "Adamovies | Movies";
    get("/api/get_reviews", {type: 'movie'}).then((reviews) => {
      this.setState({reviews: reviews});
    });
  }

  render() {
    const reviews_list = this.state.reviews.length !== 0? this.state.reviews.map((review) => 
      <SingleReview review={review} />
    ) : <div></div>;
    return (
      <>
      <div className='bg'>
        <h1 className="u-pageHeader">Movies</h1>
        <div className="Reviews-container">{reviews_list}</div>
      </div>
      </>
    );
  }
}
export default Movies;
