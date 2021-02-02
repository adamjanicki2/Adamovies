import React, { Component } from "react";
import "./NewInput.css";
import { post } from "../../utilities";


/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */

class NewInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleSubmit = (event) => {
    if (this.state.value !== ''){
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.value);
      this.setState({
        value: "",
      });
    } 
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      if (this.state.value !== ''){
        event.preventDefault();
        this.props.onSubmit && this.props.onSubmit(this.state.value);
        this.setState({
          value: "",
        });
      } 
    }
  }

  render() {
    return (
      <div className="u-flex">
        <input
          type="text"
          placeholder={this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          className="NewPostInput-input"
          maxLength="200"
        />
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Comment
        </button>
      </div>
    );
  }
}


class NewComment extends Component {
  constructor(props) {
    super(props);
  }

  addComment = (value) => {
    const body = { review_id: this.props.movieId, content: value };
    post("/api/new_comment", body);
  };

  render() {
    return <NewInput defaultText="Add New Comment" onSubmit={this.addComment} />;
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }


  handleChange = (event) => {
    if (event.target.value === '' && this.state.value !== ''){
      this.props.onSubmit && this.props.onSubmit('');
    }
    this.setState({
      value: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.value);
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter'){
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.value);
    }
  }

  render() {
    return (
    <div className='search-bar'>
      <div className="u-flex">
        <input
          type="search"
          placeholder={this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          className="NewPostInput-input"
          maxLength="200"
        />
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Search
        </button>
      </div>
    </div>
    );
  }
}

export { NewComment, SearchBar };