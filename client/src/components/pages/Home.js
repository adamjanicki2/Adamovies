import React, { Component } from "react";
import "../../utilities.css";
import "./Home.css";
import SingleReview from "../modules/SingleReview.js";
import { get } from "../../utilities.js";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recent_reviews: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Adamovies';
    get("/api/recent_reviews").then((reviews) => {
      this.setState({recent_reviews: reviews});
    });
  }

  render() {
    if (this.state.recent_reviews === undefined){
      return (<div></div>);
    }
    const reviews_list = this.state.recent_reviews.length !== 0? this.state.recent_reviews.map((review) => 
      <SingleReview review={review} admin={this.props.admin} root={this.props.root}/>
    ) : <div className='u-textCenter'>No Recent Reviews!</div>;
    return (
      <>
      <div className='bg'>
        <h1 className="u-pageHeader">Recent Reviews</h1>
        <div className='Reviews-container'>
          {reviews_list}
        </div>
      </div>
      </>
    );
  }
}
export default Home;
