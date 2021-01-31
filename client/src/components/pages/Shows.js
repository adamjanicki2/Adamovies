import React, { Component } from "react";
import "../../utilities.css";
import "./Reviews.css";
import SingleReview from "../modules/SingleReview.js";
import { get } from "../../utilities.js";
class Shows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
    };
  }

  componentDidMount() {
    document.title = "Adamovies | TV Shows";
    get("/api/get_reviews", {type: 'show'}).then((reviews) => {
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
        <h1 className="u-pageHeader">TV Shows</h1>
        <div>{reviews_list}</div>
      </div>
      </>
    );
  }
}
export default Shows;
