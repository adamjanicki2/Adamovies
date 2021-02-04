import React, { Component } from "react";
import "../../utilities.css";
import BottomBar from "../modules/BottomBar";
import QA from "../modules/QA.js";

class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [
        'What is Adamovies?',
        'Do I need an account to use Adamovies?',
        'How do I change my username?',
        'After I sign in, will other users be able to see my first and last name or other private information?',
        'What does the percentage under reviews mean?',
        'How do I post a review?',
        'What are the announcements for?',
        "Why can't I unlike a review?",
        'Is Adamovies fun?',
      ],
      answers: [
        'Adamovies is a site where myself and other admins review movies and TV shows so all the users can read about them. You can check the About page for more information!',
        "No! You don't have to sign in to use Adamovies, however, you won't be able to comment on or like reviews unless you do!",
        'After signing in, you can click on your name in the top right corner, which will take you to your profile page, where you can change your username, and other bio information.',
        "The only information other users can see is your username, profile picture, your favorite show, your favorite movie, your currently watching, and your bio. Your username is set to your name by default, but changing it will ensure no users can view your name, as updating your username will also update your username in any of the comment you've written.",
        "The percentage represents the score out of 100% that the admin reviewer gave to the film or show. The higher percentage, the better the admin liked it! Users can use the like feature to show their support for films or shows.",
        "Adamovies uses an admin system, so only hand-picked users are able to post reviews. If you gain my trust through comments, I just might make you a site admin though!",
        "Announcements are posted by admin when we add a review we think people will want to see; it's a way of giving attention to specific reviews.",
        "Because it would hurt my feelings! No, so due to a little quirk with the database, enabling users to unlike a review would result in inefficient runtimes.",
        'I think it is! I tried to design this site as a fun place for reading and talking about movies and shows!',

      ],
    }
  }
  componentDidMount(){
    window.scrollTo(0, 0);
    document.title = 'Adamovies | FAQ';
  }
  render() {
    let questions_to_display = [];
    for (let i = 0;i<this.state.questions.length; i++){
      questions_to_display.push(<QA question={this.state.questions[i]} answer={this.state.answers[i]}/>);
    }
    return (
      <div className='bg'>
        <h1 className='u-pageHeader u-textCenter'>Frequently Asked Questions</h1>
        <div>{questions_to_display}</div>   
        <BottomBar /> 
      </div>
    );
  }
}

export default FAQ;
