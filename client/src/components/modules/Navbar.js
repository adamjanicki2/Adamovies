import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "./Navbar.css";
import logo from '../../public/img/adamovies45.png';
import { convertPicture } from "../../utilities.js";
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
        picture_to_use = convertPicture(SIZE_, this.props.picture);
      }

      return (
        <nav className="Navbar-container">
          <div className="nav-container">
            <div className="nav-titlecontainer" onClick={()=>{navigate('/')}}>
              <div u-bordering><img src={logo} className='Navbar-logo'/></div>
              <div className="Navbar-title">ADAMOVIES</div>
            </div>
            <div className="link-container">
            <Link to="/" className={this.props.location.pathname === '/'? "Navbar-route Route-clicked":"Navbar-route"}>
                Home
              </Link>
            
              <Link to="/movies" className={this.props.location.pathname === '/movies'? "Navbar-route Route-clicked":"Navbar-route"} >
                Movies
              </Link>

              <Link to="/tvshows" className={this.props.location.pathname === '/tvshows'? "Navbar-route Route-clicked":"Navbar-route"} >
                TV Shows
              </Link>

              {this.props.admin === true &&
                <Link to="/post_review" className={this.props.location.pathname === '/post_review'? "Navbar-route Route-clicked":"Navbar-route"} >
                Post
              </Link>}
              {this.props.root === true && <Link to="/root_console" className={this.props.location.pathname === '/root_console'? "Navbar-route Route-clicked":"Navbar-route"} >
                Root
              </Link>}
            </div>
            <div className="log-container">
              {this.props.userId && <div className='pfpname-container' onClick={() => {navigate('/myprofile')}}>
                <img src={picture_to_use} className='Navbar-pfp'/>
                <h2 className="Navbar-name">{this.props.name.split(" ")[0]}</h2>
              </div>}
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
          </div>
          
        </nav>
      );
    }
  }
  
  export default Navbar;
