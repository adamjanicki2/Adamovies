import React, { Component } from "react";
import { Router, Location, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home.js";
import Movies from "./pages/Movies.js";
import Shows from "./pages/Shows.js";
import Profile from "./pages/Profile.js";
import Navbar from "./modules/Navbar.js";
import ReviewPage from "./pages/ReviewPage.js";
import PostReview from "./pages/PostReview.js";
import OtherProfile from "./pages/OtherProfile.js";
import ReviewSuccess from "./pages/ReviewSuccess.js";
import EditReview from "./pages/EditReview.js";
import RootConsole from "./pages/RootConsole.js";
import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import BottomBar from "./modules/BottomBar.js";
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      user_name: '',
      user_picture: null,
      admin: null,
      root: null,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        this.setState({ userId: user._id, user_name: user.name, user_picture: user.picture, admin: user.admin, root: user.root, });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      post("/api/update_timestamp").then((success) => {
        this.setState({ userId: user._id , user_name: user.name, user_picture: user.picture, admin: user.admin, root: user.root});
        post("/api/initsocket", { socketid: socket.id });
      });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined, user_name: "", user_picture: null, admin: null, root: null });
    post("/api/logout");
    navigate('/');
  };

  render() {
    return (
      <>
      <div className='bg'>
      <Location>
          {locationProps => (
            <Navbar
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
            admin={this.state.admin}
            root={this.state.root}
            name={this.state.user_name}
            picture={this.state.user_picture}
            location={locationProps.location}
          />
          )}
        </Location>
        <Router>
          <Home path="/" userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>
          <Movies path='/movies' userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>
          <Shows path='/tvshows' userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>
          <ReviewPage path='/review/:movieId' userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>
          {this.state.userId && <Profile path='/myprofile' userId={this.state.userId}/>}
          <OtherProfile path="/user/:userId"/>
          {this.state.admin === true && <PostReview path="/post_review" userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>}
          {this.state.admin === true && <ReviewSuccess path="/review_success"/>}
          {this.state.admin === true && <EditReview path='/edit_review/:reviewId' userId={this.state.userId}/>}
          {this.state.root === true && <RootConsole path='/root_console' userId={this.state.userId} root={this.state.root}/>}
          <NotFound default />
        </Router>
        <BottomBar />
        </div>
      </>
    );
  }
}

export default App;
