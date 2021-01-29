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

      return (
        <nav className="Navbar-container">
          <img src={logo} className='Navbar-logo u-inlineBlock'/>
          <div className="Navbar-title u-inlineBlock" onClick={() => {this.navigate_home()}}>Adamovies</div>
          <div className="Navbar-routeContainer u-inlineBlock">
          {this.props.userId !== undefined ? (
              <Link to="/dashboard" className={this.props.location.pathname === '/dashboard'? "Navbar-route Route-clicked":"Navbar-route"}>
                Dashboard
              </Link>
            ) : (<div></div>)}
            {this.props.userId !== undefined ? (
              <Link to="/predictions" className={this.props.location.pathname === '/predictions'? "Navbar-route Route-clicked":"Navbar-route"} >
                Predict
              </Link>
            ) : (<div></div>)}
            {this.props.userId !== undefined ? (
              <Link to="/overallstandings" className={this.props.location.pathname === '/overallstandings'? "Navbar-route Route-clicked":"Navbar-route"} >
                Standings
              </Link>
            ) : (<div></div>)}
          </div>

          <div className='Navbar-logout u-inlineBlock Navbar-rightside'>
          {this.props.userId !== undefined? 
          <div className='Navbar-rightside'>
            <div className="u-inlineBlock Navbar-pfpContainer">
              <img src={picture_to_use} className='Navbar-pfp'/>
            </div>
            <Link to="/MyProfile" className='Navbar-name u-inlineBlock'>{this.props.name.split(" ")[0]} </Link>
          </div>
          :<div/>}
          {this.props.userId !== undefined? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='button-log'>Log Out</button>
              )}
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='button-log'>Log In</button>
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
