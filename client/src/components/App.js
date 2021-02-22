import React, { Component } from "react";
import { Router, Location, navigate } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Navbar from "./modules/Navbar.js";
import ReviewPage from "./pages/ReviewPage.js";
import PostReview from "./pages/PostReview.js";
import OtherProfile from "./pages/OtherProfile.js";
import EditReview from "./pages/EditReview.js";
import EditDraft from "./pages/EditDraft.js";
import RootConsole from "./pages/RootConsole.js";
import FAQ from "./pages/FAQ.js";
import About from "./pages/About.js";
import "../utilities.css";
import Reviews from "./pages/Reviews.js"
import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import Stats from "./pages/Stats.js";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      user_name: '',
      user_picture: null,
      admin: null,
      root: null,
      timestamp: null,
      can_comment: undefined,
      new_comments: undefined,
      username: undefined,
      last_login: undefined,
      new_mentions: undefined,
    };
  }

  initializeMentionSocket = (uid) => {
    socket.on("mention "+uid, (data) => {
      let delta = data.deleted? -1 : 1;
      if (this.state.new_mentions + delta < 0){
        delta = 0;
      }
      this.setState((previous_state) => ({
        new_mentions: previous_state.new_mentions + delta,
      }));
    });
  };

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        this.initializeMentionSocket(user._id);
        this.setState({ last_login: user.last_login, userId: user._id, username: user.username, user_name: user.name, user_picture: user.picture, admin: user.admin, root: user.root, timestamp: user.last_login, can_comment: user.can_comment})
          if (user.root){
            get("/api/comments_since_timestamp", {timestamp: user.last_login}).then((comment_data) => {
              this.setState({new_comments: comment_data.data.length});
            });
          }
          get("/api/new_mentions", {timestamp: user.last_login}).then((new_mentions) => {
            this.setState({new_mentions: new_mentions.length});
          });
      }
    });
  }

  handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      if (user.banned){
        window.alert("You've been banned from having an Adamovies account. This means you can no longer comment or have a profile.");
      }else{
        this.initializeMentionSocket(user._id);
        this.setState({ last_login: user.last_login, userId: user._id , username: user.username, user_name: user.name, user_picture: user.picture, admin: user.admin, root: user.root, timestamp: user.last_login, can_comment: user.can_comment})
          if (user.root){
            get("/api/comments_since_timestamp", {timestamp: user.last_login}).then((comment_data) => {
              this.setState({new_comments: comment_data.data.length});
            });
          }
          get("/api/new_mentions", {timestamp: user.last_login}).then((new_mentions) => {
            this.setState({new_mentions: new_mentions.length});
          });
        post("/api/initsocket", { socketid: socket.id });
      }
    });
  };

  handleLogout = () => {
    socket.off("mention "+this.state.userId);
    this.setState({ last_login: undefined, userId: undefined, user_name: "", username: undefined, user_picture: null, admin: null, root: null , timestamp: null, can_comment: undefined, new_comments: undefined, new_mentions: undefined});
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
            new_comments={this.state.new_comments}
            new_mentions={this.state.new_mentions}
          />
          )}
        </Location>
        <Router>
          <Reviews path='/movies' userId={this.state.userId} admin={this.state.admin} root={this.state.root} type={'movie'}/>
          <Reviews path='/tvshows' userId={this.state.userId} admin={this.state.admin} root={this.state.root} type={'show'}/>
          <Home path="/" userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>
          <ReviewPage path='/review/:movieId' username={this.state.username} userId={this.state.userId} admin={this.state.admin} root={this.state.root} user_can_comment={this.state.can_comment}/>
          {this.state.userId && <Profile path='/myprofile' userId={this.state.userId} last_login={this.state.last_login}/>}
          <OtherProfile path="/user/:userId"/>
          {this.state.admin === true && <PostReview path="/post_review" userId={this.state.userId} admin={this.state.admin} root={this.state.root}/>}
          {this.state.root === true && <EditReview path='/edit_review/:reviewId' userId={this.state.userId}/>}
          {this.state.root === true && <RootConsole path='/root_console' userId={this.state.userId} root={this.state.root} timestamp={this.state.timestamp}/>}
          {this.state.admin === true && <EditDraft path={'/draft/:draftId'} userId={this.state.userId} admin={this.state.admin}/>}
          <FAQ path='/faq'/>
          <About path='/about'/>
          <Stats path='/statistics'/>
          <NotFound default />
        </Router>
        </div>
      </>
    );
  }
}

export default App;
