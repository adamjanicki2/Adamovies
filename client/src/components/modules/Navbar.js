import React, { Component,useEffect } from "react";
import { Link, navigate } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "./Navbar.css";
import logo from '../../public/img/adamovies45.png';
const GOOGLE_CLIENT_ID = "577990730068-40v41c82e6bd14pj40khj7f2nbqhnasu.apps.googleusercontent.com";

class Navbar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }

    componentDidMount (){

    };
    
    navigate_home() {
      navigate('/');
    };

    render() {
      let picture_to_use=null;
      if (this.props.picture !== null){
        const SIZE_ = '36'; //dimensions of pfp, change this number to change the size, make sure to change width/h in navbar.css
        if (this.props.picture.split('/')[this.props.picture.split('/').length - 2] === 's96-c'){
          let arr = this.props.picture.split('/');
          arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
          picture_to_use = arr.join('/');
        }else if (this.props.picture.split('=')[this.props.picture.split('=').length - 1] === 's96-c'){
          let arr = this.props.picture.split('=');
          arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
          picture_to_use = arr.join('=');
        }else{
          picture_to_use = this.props.picture;
        }
        
      }

      return (
        <nav className="Navbar-container">
          <img src={logo} className='Navbar-logo u-inlineBlock'/>
          <div className="Navbar-title u-inlineBlock">ADAMOVIES</div>
          <div className="Navbar-routeContainer u-inlineBlock">

              <Link to="/" className={this.props.location.pathname === '/'? "Navbar-route Route-clicked":"Navbar-route"}>
                Home
              </Link>
            
              <Link to="/movies" className={this.props.location.pathname === '/movies'? "Navbar-route Route-clicked":"Navbar-route"} >
                Movies
              </Link>

              <Link to="/tvshows" className={this.props.location.pathname === '/tvshows'? "Navbar-route Route-clicked":"Navbar-route"} >
                TV Shows
              </Link>

              {this.props.admin === true? (
                <Link to="/post_review" className={this.props.location.pathname === '/post_review'? "Navbar-route Route-clicked":"Navbar-route"} >
                Post
              </Link>
              ) : (<div></div>)}

          </div>


          <div className='Navbar-logout u-inlineBlock Navbar-rightside'>
          {this.props.userId !== undefined? 
          <div className='Navbar-rightside'>
            <div className="u-inlineBlock Navbar-pfpContainer">
              <img src={picture_to_use} className='Navbar-pfp'/>
            </div>
            <Link to="/myprofile" className='Navbar-name u-inlineBlock'>{this.props.name.split(" ")[0]} </Link>
          </div>
          :<div/>}
          {this.props.userId !== undefined? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='button-log'>Sign Out</button>
              )}
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='button-log'>Sign In</button>
              )}
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}              
            />
          )}
          </div>
        </nav>
      );
    }
  }
  
  export default Navbar;
