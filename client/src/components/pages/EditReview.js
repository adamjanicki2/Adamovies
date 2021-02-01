import React, { Component } from "react";
import "../../utilities.css";
import "./PostReview.css";
import { get, post } from "../../utilities.js";

class EditReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
        review: undefined,
    };
  }

  componentDidMount() {
    document.title = "Adamovies | Edit Review";
    get("/api/get_single_review", {movieId: this.props.reviewId}).then((single_review) => {
        this.setState({review: single_review});
    });
  }

  render() {
    if (!this.state.review){
        return (<div></div>);
    }
    return (
      <div className='bg'>
        <h1 className='u-textCenter'>Edit Review page for: {this.state.review.title}</h1>
      </div>
    );
  }
}

export default EditReview;
