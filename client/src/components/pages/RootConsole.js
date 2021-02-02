import React, { Component } from "react";
import "../../utilities.css";
import { get, post, convertPicture } from "../../utilities.js";


class RootConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: undefined,
    };
  }

  componentDidMount() {
    document.title = 'Adamovies | Root Console';
    get('/api/get_all_other_users').then((all_users) =>{
        this.setState({all_users: all_users});
    })
    
  }

  render() {
    if (!this.state.all_users || !this.props.root){
        return (<div></div>);
    }
    return (
        <h1 className='u-textCenter'>Root Console</h1>
    );
  }
}
export default RootConsole;
