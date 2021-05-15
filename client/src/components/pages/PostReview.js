import React, { Component } from "react";
import { get, post, inputBox } from "../../utilities.js";
import { navigate } from '@reach/router';
import "../../utilities.css";
import logo from "../../public/img/black180.png";
import BottomBar from "../modules/BottomBar.js";
import "./RootConsole.css";
import "./FAQ.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
class PostReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      media_type: '',
      title: '',
      season: undefined,
      episode: undefined,
      rating: undefined,
      director: '',
      review_content: '',
      img_url: '',
      trailer_link: '',
      release_year: undefined,
      runtime: undefined,
      mpa_rating: '',
      genre: '',
      drafts: undefined,
    };
  }
  componentDidMount() {
    document.title = "Post Review | Adamovies";
    get("/api/whoami").then((user) => {
      this.setState({user: user});
    });
    get("/api/get_user_drafts").then((drafts) => {
      this.setState({drafts: drafts});
    });
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }
  checkFilled = () => {
    return (this.state.media_type==='movie' && (this.state.runtime===undefined || this.state.runtime===null || this.state.runtime==='')) || this.state.title==='' || this.state.genre==='' || this.state.media_type==='' || this.state.director==='' || this.state.review_content==='' || this.state.rating===null ||this.state.rating===undefined||this.state.rating==='' || this.state.img_url==='' || this.state.mpa_rating==='' || this.state.trailer_link==='' || this.state.release_year===undefined || this.state.release_year===null || this.state.release_year==='';
  };
  saveDraft = () => {
    const body = {
      release_year: this.state.release_year,
      title: this.state.title,
      media_type: this.state.media_type,
      rating: this.state.rating,
      director: this.state.director,
      content: this.state.review_content.split('\n'),
      img_url: this.state.img_url,
      trailer_link: this.state.trailer_link,
      season: this.state.season? this.state.season : 0,
      episode: this.state.episode? this.state.episode : 0,
      runtime: this.state.runtime? this.state.runtime : 0,
      mpa_rating: this.state.mpa_rating,
      genre: this.state.genre
    };
    if (window.confirm('Click OK to save this as a new draft')){
      post("/api/new_draft", body).then((success) => {
        navigate("/");
      });
    }
  };

  deleteDraft = (draft_id) => {
    if (window.confirm("Click OK to delete this draft")){
      post("/api/delete_draft", {draftId: draft_id}).then((success)=>{
        this.setState((prev) => ({
          drafts: prev.drafts.filter(draft => draft._id !== draft_id),
        }));
      });
    }
  };

  handleSubmit = () => {
    if (this.checkFilled()) {
      window.alert("Fill in all fields!")
    }else{
      if (window.confirm("Click OK to submit your review!")){
        const body = {
          release_year: this.state.release_year,
          title: this.state.title,
          media_type: this.state.media_type,
          rating: this.state.rating,
          director: this.state.director,
          content: this.state.review_content.split('\n'),
          img_url: this.state.img_url,
          trailer_link: this.state.trailer_link,
          season: this.state.season? this.state.season : 0,
          episode: this.state.episode? this.state.episode : 0,
          runtime: this.state.runtime? this.state.runtime : 0,
          mpa_rating: this.state.mpa_rating,
          genre: this.state.genre
        };
    
        post('/api/new_review', body).then((response) => {
          //console.log(response);
          navigate("/");
        });
      }
    }
  };
  
  render() {
    if (!this.state.user || !this.state.user.admin){
      return (<div></div>);
    }
    return (
      <div className="bg">
        <h1 className="u-pageHeaderInter u-textCenter">Welcome back, {this.state.user.name.split(' ')[0]}!</h1>
        {this.state.media_type === '' &&this.state.drafts!==undefined&& 
        <div>
          <h1 className='u-textCenter'>Your Drafts</h1>
          {!this.state.drafts[0]? <h2 className='u-textCenter'>You have no drafts!</h2> : 
          <div className="table-container-draft">
          <table className='styled-table2'>
          <thead >
            <tr>
              <th className='tabletitletext2'>Title</th>
              <th className='tabletitletext2'>Type</th>
              <th className='tabletitletext2'>Actions</th>
            </tr>
            </thead>
          <tbody>
            {this.state.drafts.map((draft) => 
            <tr>
              <td><div className='table-cell' onClick={()=>{navigate(`/draft/${draft._id}`)}}>{draft.title}</div></td>
              <td>{draft.type}</td>
              <td><div><FontAwesomeIcon onClick={()=>{navigate(`/draft/${draft._id}`)}} icon={faEdit} size={'1x'} className='edit-icon'/><FontAwesomeIcon onClick={()=>{this.deleteDraft(draft._id)}}className='trash-icon'icon={faTrashAlt} size={'1x'}/></div></td>
          </tr>
      )}
      </tbody>
      </table>
      </div>}
        </div>}
        <div className="centered-elements"><select name='media_type' className='dropdown' onChange={this.handleChange}>
          <option value='' selected>Select New Review Type</option>
          <option value="movie">Movie</option>
          <option value="show">TV Show</option>
        </select></div>
        {this.state.media_type === '' && <div className='About-container instruction-body'>
        <p className='about-text'>Hi {this.state.user.name.split(' ')[0]}! Thanks for being an admin! Here are instructions on how to post reviews:
         <br></br><br></br><div className='u-bold u-underline'>Starting a Review</div>To start a review, simply select what media type your review is going to be on. Once you select this, 
         an input form will pop up, where you can enter in all of the information.
         <br></br><div className='u-bold u-underline'>Saving a Draft</div> Don't have time to finish a review? No worries! If you ever need to save a draft of your review to come back to later, simply click the 'Save Draft' 
         button at the bottom of the form, and your progress will be saved for next time!
         <br></br><div className='u-bold u-underline'>Continuing a draft</div>To continue a draft you previously saved, you can check the table above these instructions. All of your saved drafts will appear here. To continue working on a draft, simply click the 'edit' button. 
         If you want to delete the draft, simply click the 'delete' button. 
         <br></br><div className='u-bold u-underline'>Submitting a Review</div>To submit a review, all you need to do is hit the submit button at the bottom of the form! However, make sure you've filled in all of the required fields! 
         For Movies, all of the fields are required, but for TV shows, the 'season' and 'episode' field are optional, so leave them blank if you choose.
         <br></br><div className='u-bold u-underline'>Information on Specific Input Fields</div>MPAA rating is something like PG-13, R, TV-14, etc. Your rating for the review must be between 0 and 100 inclusive. For genre, try to pick the best one, it should be something like: Action, Adventure, Drama, Sci-Fi, Thriller, Reality TV, Comedy, etc. If you need to use multiple, separate genres with a slash '/' like so: 'Action/Adventure'.
         When finding an image to use for the Image URL, right click the image on google images and click 'open image in new tab', so you can make sure the image loads before you copy and paste it into the image URL field.
         <br></br><div className='u-bold u-underline'>Final Notes</div>Encourage user participation in the comments! It'll seem like you're a youtuber, but it's fun to get feedback on our reviews! Have fun writing your review!! 
         <br></br>
        </p>
        <div className="centered-elements Adamovies-logo180"><img className="Adamovies-logo180bordering" src={logo}/></div>
        </div>}
        {this.state.media_type !== '' && <div className='Post-container'>
          
          <div className="Entry-flex">
            <h2 className='field-text'>Title</h2>
            {inputBox('text', 'title', this.state.title, this.handleChange,
            "Review-input", this.state.media_type === "movie"? "Inception" : "The Mandalorian", 
            true, undefined, undefined, "40")}
          </div>

          {this.state.media_type === 'show' && <div className="Entry-flex">
            <h2 className='field-text'>Season</h2>
            {inputBox('number', 'season', this.state.season, this.handleChange,
            "Review-input", '0', 
            false, '0', '100')}
          </div>}

          {this.state.media_type === 'show' && <div className="Entry-flex">
            <h2 className='field-text'>Episode</h2>
            {inputBox('number', 'episode', this.state.episode, this.handleChange, 
            "Review-input", '0', false, '0', '100')}
          </div>}

          {this.state.media_type === 'movie' && <div className="Entry-flex">
            <h2 className='field-text'>Runtime</h2>
            {inputBox('number', 'runtime', this.state.runtime,
            this.handleChange, 'Review-input', '169', '0', '300')}
          </div>}

          <div className="Entry-flex">
            <h2 className='field-text'>Rating</h2>
            {inputBox('number', 'rating', this.state.rating, this.handleChange,
            'Review-input', '97', true, '0', '100')}
          </div>

          <div className="Entry-flex">
            <h2 className='field-text'>MPAA Rating</h2>
            {inputBox('text', 'mpa_rating', this.state.mpa_rating, this.handleChange,
            'Review-input', this.state.media_type === 'movie'? "PG-13" : "TV-14",
            true, undefined, undefined, '5')}
          </div>
          
          <div className="Entry-flex">
            <h2 className='field-text'>Release Year</h2>
            {inputBox('number', 'release_year', this.state.release_year,
            this.handleChange, 'Review-input', this.state.media_type === 'movie'? "1993" : "2015",
            true, '0', '2100')}
          </div>

          <div className="Entry-flex">
            <h2 className='field-text'>Director</h2>
            {inputBox('text', 'director', this.state.director, 
            this.handleChange, 'Review-input', this.state.media_type === 'movie'? "Mary Harron" : "Sam Esmail",
            true, undefined, undefined, '40'
            )}
          </div>

          <div className="Entry-flex">
            <h2 className='field-text'>Genre</h2>
            {inputBox('text', 'genre', this.state.genre, 
            this.handleChange, 'Review-input', this.state.media_type === 'movie'? "Action/Sci-fi" : "Crime/Drama",
            true, undefined, undefined, '20')}
          </div>

          <div className="Entry-flex">
            <h2 className='field-text'>Image URL</h2>
            {inputBox('text', 'img_url', this.state.img_url, 
            this.handleChange, 'Review-input', "https://url.com/pic.jpg", true,
            undefined, undefined, '500')}
          </div>

          <div className="Entry-flex">
            <h2 className='field-text'>Trailer Link</h2>
            {inputBox('text', 'trailer_link', this.state.trailer_link, 
            this.handleChange, 'Review-input', 'https://youtube.com/...',
            true, undefined, undefined, '200')}
          </div>
          <div className='Review-flex'>
            <h2 className='field-text'>Review</h2>
            <textarea
            name='review_content'
            required={true}
            maxLength='10000'
            value={this.state.review_content}
            className="Content-input"
            placeholder="Enter your new review here!"
            onChange={this.handleChange}
            rows='16'
            />
          </div>
          {this.state.media_type !== '' && <div className='centered-elements post-submit'><button
          type="submit"
          className="Submit-button-draft u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit Review
        </button>
        <button
          type="submit"
          className="Submit-button-draft u-pointer"
          value="Submit"
          onClick={this.saveDraft}
        >
          Save Draft
        </button></div>}
        </div>}
        <BottomBar/>
      </div>
    );
  }
}
export default PostReview;