import React, { Component } from "react";
import "./NewInput.css";
import { post } from "../../utilities";
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
          className="NI-input"
          maxLength="200"
        />
        <button
          type="submit"
          className="NI-button u-pointer"
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
    const body = { review_id: this.props.movieId, content: value, title: this.props.title };
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
          className="NI-input"
          maxLength="200"
        />
        <button
          type="submit"
          className="NI-button u-pointer"
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

class NewAnnouncement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title_value: "",
      content_value: "",
    };
  }


  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleSubmit = (event) => {
    if(this.state.content_value !== '' && this.state.title_value !== ''){
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.title_value, this.state.content_value);
      this.setState({title_value: '', content_value: ''});
    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && this.state.content_value !== '' && this.state.title_value !== ''){
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.title_value, this.state.content_value);
      this.setState({title_value: '', content_value: ''});
    }
  }

  render() {
    return (
      <div className="bar-container">
      <input
        type="text"
        name='title_value'
        placeholder='Announcement title'
        value={this.state.title_value}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        className="left-input"
        maxLength="40"
      />
      <input
        type="text"
        name='content_value'
        placeholder='Enter announcement here!'
        value={this.state.content_value}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        className="middle-input"
        maxLength="300"
      />
      <button
        type="submit"
        className="NI-button u-pointer"
        value="Submit"
        onClick={this.handleSubmit}
      >
        Announce
      </button>
    </div>
    );
  }
}

export { NewComment, SearchBar, NewAnnouncement };