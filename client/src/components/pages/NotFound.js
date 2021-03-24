import React, { Component } from "react";
import "../../utilities.css";
import logo from "../../public/img/black180.png";
import SingleReview from "../modules/SingleReview.js";
import { get } from "../../utilities.js";
class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      random_review: undefined,
    };
  }

  componentDidMount(){
      get("/api/random_review").then((random_review) => {
        this.setState({random_review: random_review});
      });
  }

  render() {
    if (!this.state.random_review){
      return <div></div>;
    }
    return (
      <div className='bg'>
        <div className="centered-elements Adamovies-logo180"><img className="Adamovies-logo180bordering" src={logo}/></div>
        <h1 className='u-textCenter Not-found'>404 Not Found</h1>
        <h2 className='u-textCenter'>Oops! Page "{window.location.pathname}" couldn't be found.</h2>
        <h2 className='u-textCenter'>Try checking out this random review!</h2>
        <div className="Reviews-container">
        <SingleReview review={this.state.random_review} admin={false} root={false} delete_review={()=>{}} unliked={this.props.userId && !this.state.random_review.liked_users.includes(this.props.userId)} userId={this.props.userId}/>
        </div>
      </div>
    );
  }
}

export default NotFound;
