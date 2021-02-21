const express = require("express");
//MODELS:
const User = require("./models/user");
const Review = require("./models/review");
const Comment = require("./models/comment");
const Announcement = require("./models/announcement");
const Draft = require("./models/draft");
const Mention = require("./models/mention");
//////////////////////
const BannedUser = require("./models/banneduser");
const auth = require("./auth");
const router = express.Router();
const socketManager = require("./server-socket");

const badwords = require('bad-words');
const filter = new badwords();
const Words = require('./words.js');

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    return res.send({});
  }else{
    User.findOne({googleid: req.user.googleid}).then((existing) => {
      res.send(existing)
    });
  }
});

function convpic(SIZE_, picture){
  if (picture.split('/')[picture.split('/').length - 2] === 's96-c'){
    let arr = picture.split('/');
    arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
    return arr.join('/');
  }else if (picture.split('=')[picture.split('=').length - 1] === 's96-c'){
    let arr = picture.split('=');
    arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
    return arr.join('=');
  }else{
    return picture;
  }
}

router.post("/initsocket", (req, res) => {
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/get_single_user", (req, res) => {
  User.findById(req.query._id).then((user) => {
    res.send(user);
  });
});

router.post("/delete_comment", auth.ensureRoot, (req, res) => {
  Comment.findByIdAndDelete(req.body.comment_id).then((deleted) => {
    socketManager.getIo().emit(req.body.review_id, {deleted: req.body.comment_id});
    Mention.find({comment_id: req.body.comment_id}).then((comment_mentions) => {
      for (const m of comment_mentions){
        socketManager.getIo().emit("mention "+m.recipient_id, {deleted: m._id});
      }
      Mention.deleteMany({comment_id: req.body.comment_id}).then((deletedagain) => {
        res.send({msg: 'Deleted comment '+req.body.comment_id});
      });
    });
  });
});

router.post("/delete_review", auth.ensureRoot, (req, res) => {
  Review.findByIdAndDelete(req.body.review_id).then((deleted) =>{
    Comment.deleteMany({review_id: req.body.review_id}).then((success) => {
      res.send({msg: "Deleted review and comments for "+req.body.review_id});
    });
  });
});

router.post("/like_review", auth.ensureLoggedIn, (req, res) => {
  //req.body.current_user_list, req.body.new_likes
  Review.updateOne({_id: req.body.review_id}, {likes: req.body.new_likes, liked_users:req.body.current_user_list.concat([req.user._id])}).then((success) => {
    res.send({msg: 'liked'});
  });
});

router.post("/edit_username", auth.ensureLoggedIn, (req, res) => {
//googleid, username
  User.findOne({username_lower: req.body.username.toLowerCase()}).then((found) => {
    if (found === null || found.googleid === req.user.googleid){
      User.updateOne({_id: req.user._id}, {username: req.body.username, username_lower: req.body.username.toLowerCase()}).then((s1) => {
        Comment.updateMany({user_id: req.user._id}, {username: req.body.username}).then((s2) => {
          if(req.user.admin === true){
            Announcement.updateMany({admin_id: req.user._id}, {admin_username: req.body.username}).then((s3)=>{
              Review.updateMany({admin_id: req.user._id}, {admin_username: req.body.username}).then((s4) => {
                res.send({is_taken: false});
              });
            });
          }else{
            res.send({is_taken: false})
          }
        });
      });
    }else{
      res.send({is_taken: true});
    }
  });
});

router.post("/update_review", auth.ensureRoot, (req, res) => {
  const data = {
    content: req.body.content,
    director: req.body.director,
    rating: parseInt(req.body.rating),
    title: req.body.title,
    release_year: parseInt(req.body.release_year),
    trailer_link: req.body.trailer_link,
    img_url: req.body.img_url,
    episode: parseInt(req.body.episode),
    season: parseInt(req.body.season),
    runtime: parseInt(req.body.runtime),
    mpa_rating: req.body.mpa_rating,
    genre: req.body.genre,
  };
  Review.updateOne({_id: req.body.review_id}, data).then((success) => {
    res.send(data);
  });
});

router.get("/get_reviews", (req, res) => {
  Review.find(req.query).sort({title: 1}).then((reviews) => {
    res.send(reviews);
  });
});

router.get("/get_single_review", (req, res) => {
  Review.findById(req.query.movieId).then((result) => {
    res.send(result);
    // console.log(result);
  });
});

router.get("/get_comments_for_review", (req, res) => {
  Comment.find({review_id: req.query.review_id}).then((comments) => {
    if(!req.query.number) res.send(comments);
    else res.send({number_comments: comments.length});
  });
});

function createMentions(ats, newComment, req, currentTime) {
  if (ats.size !== 0){
    ats.forEach(function(mention) {
      User.findOne({username_lower: mention.substring(1).toLowerCase()}).then((found) => {
          if (found !== null && found !== undefined){
            const mention_data = {
              recipient_username: found.username,
              recipient_username_lower: found.username.toLowerCase(),
              recipient_id: found._id,
              sender_id: req.user._id,
              sender_username: req.user.username,
              timestamp: currentTime,
              review_id: req.body.review_id,
              title: req.body.title,
              comment_id: newComment._id,
              sender_picture: convpic("18", req.user.picture),
              comment_content: newComment.content,
            };
            Mention.create(mention_data).then((created_mention) => {
              socketManager.getIo().emit("mention "+mention_data.recipient_id, created_mention);
            });
          }
      });
    });
  }
}

router.post("/new_comment", auth.ensureLoggedIn, (req, res) => {
  if (filter.isProfane(req.body.content)) {
    res.send({msg: 'bad language!'});
  }
  else{
    User.findById(req.user._id).then((existing_user) => {
      let picture_to_use = null;
      if (req.user.picture !== null){
        const SIZE_ = '18';
        if (req.user.picture.split('/')[req.user.picture.split('/').length - 2] === 's96-c'){
          let arr = req.user.picture.split('/');
          arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
          picture_to_use = arr.join('/');
        }else if (req.user.picture.split('=')[req.user.picture.split('=').length - 1] === 's96-c'){
          let arr = req.user.picture.split('=');
          arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
          picture_to_use = arr.join('=');
        }else{
          picture_to_use = req.user.picture;
        }
      }
      const currentTime = Date.now();
      let ats = new Set();
      for (const chunk of req.body.content.split(" ")){
        if(chunk.includes("@")){
          ats.add(chunk);
        }
      }      
      const data = {
        user_name: req.user.name,
        user_id: req.user._id,
        user_googleid: req.user.googleid,
        review_id: req.body.review_id,
        content: req.body.content,
        picture: picture_to_use,
        title: req.body.title,
        timestamp: currentTime,
        username: existing_user.username,
      };
      Comment.create(data).then((newComment) => {
        socketManager.getIo().emit(req.body.review_id, newComment);
        createMentions(ats, newComment, req, currentTime);
        res.send(newComment);
      });
    });
  }
});

router.post("/update_timestamp", auth.ensureLoggedIn, (req, res) => {
  User.updateOne({_id: req.user._id}, {last_login: Date.now()}).then((r) => {
    res.send({msg: 'success'});
  });
});

router.get("/new_mentions", auth.ensureLoggedIn, (req, res) => {
  Mention.find({recipient_id: req.user._id, timestamp: {$gt: req.query.timestamp}}).sort({timestamp: 1}).then((new_mentions) => {
    res.send(new_mentions);
  });
});

router.post("/new_review", auth.ensureAdmin, (req, res) => {
  const data = {
    admin_name: req.user.name,
    admin_id: req.user._id,
    admin_googleid: req.user.googleid,
    admin_username: req.user.username,
    admin_picture: convpic('28', req.user.picture),
    type: req.body.media_type,
    content: req.body.content,
    director: req.body.director,
    rating: parseInt(req.body.rating),
    title: req.body.title,
    release_year: parseInt(req.body.release_year),
    trailer_link: req.body.trailer_link,
    img_url: req.body.img_url,
    timestamp: Date.now(),
    episode: parseInt(req.body.episode),
    season: parseInt(req.body.season),
    runtime: parseInt(req.body.runtime),
    mpa_rating: req.body.mpa_rating,
    genre: req.body.genre,
    liked_users: [],
    likes: 0,
  };
  const newReview = new Review(data);
  newReview.save();
  socketManager.getIo().emit(req.body.media_type , data);
  res.send(data);
});

router.post("/update_profile", auth.ensureLoggedIn, (req, res) => {
    User.updateOne({googleid: req.body.googleid}, 
      {currently_watching: req.body.new_c,
        favorite_movie: req.body.new_m,
        favorite_show: req.body.new_s,
        bio: req.body.bio,
      }).then((updated) => {
        res.send({is_valid: true});
      });
});

router.post("/is_badwords", (req, res) => {
  let is_bad = false;
  for (let i = 0; i<req.body.text.length; i++){
    if (filter.isProfane(req.body.text[i])){
      is_bad = true;
    }
  }
  res.send({is_bad: is_bad});
});

router.get("/recent_reviews", (req, res) => {
  const NUMBER_REVIEWS = 18;
  Review.find({}).sort({timestamp: -1}).then((sorted_reviews) => {
    const end_index = sorted_reviews.length > NUMBER_REVIEWS? NUMBER_REVIEWS : sorted_reviews.length;
    res.send(sorted_reviews.slice(0, end_index));
  });
});

router.get("/get_all_other_users", auth.ensureRoot, (req, res) => {
  User.find({_id: {$ne: req.user._id}}, {_id: 1, username: 1, name: 1, admin: 1, picture: 1, googleid: 1, locked: 1, can_comment: 1}).then((all_users) => {
    res.send(all_users);
  });
})

router.post("/update_user_admin", auth.ensureRoot, (req, res) => {
  User.updateOne({_id: req.body.user_id}, {admin: req.body.new_admin_status}).then((success) => {
    res.send({msg: 'success'});
  });
});

router.post("/new_announcement", auth.ensureAdmin, (req, res) => {
  const newAnnouncement = {
    admin_name: req.user.name,
    admin_id: req.user._id,
    admin_username: req.user.username,
    admin_picture: convpic('18', req.user.picture),
    title: req.body.title,
    content: req.body.content,
    timestamp: Date.now(),
  };
  const New_Announcement = new Announcement(newAnnouncement);
  New_Announcement.save();
  socketManager.getIo().emit('announcement', newAnnouncement);
  res.send(newAnnouncement);
});

router.get("/recent_announcements", (req, res) => {
  const NUMBER_ANNOUNCEMENTS = 30;
  Announcement.find({}).sort({timestamp: -1}).then((sorted_announcements) => {
    const end_index = sorted_announcements.length > NUMBER_ANNOUNCEMENTS? NUMBER_ANNOUNCEMENTS : sorted_announcements.length;
    res.send(sorted_announcements.slice(0, end_index));
  });
});

router.get("/get_all_announcements", auth.ensureRoot, (req, res) => {
  Announcement.find({}).sort({timestamp: -1}).then((sorted_announcements) => {
    res.send(sorted_announcements);
  });
});

router.post("/delete_announcement", auth.ensureRoot, (req, res)=>{
  Announcement.findByIdAndDelete(req.body.announcement_id).then((deleted) => {
    res.send({msg: 'deleted announcement'});
  });
});

router.get("/get_all_bannedusers", auth.ensureRoot, (req, res) => {
  BannedUser.find({}).then((users) => {
    res.send(users);
  });
});

router.post("/ban_user", auth.ensureRoot, (req,res) => {
  //req.body.user
  User.findByIdAndDelete(req.body.user._id).then((success) => {
    Comment.deleteMany({user_googleid: req.body.user.googleid}).then((success_) => {
      Mention.deleteMany({sender_id: req.body.user._id}).then((success__) => {
        const newBanned = new BannedUser({name: req.body.user.name, googleid: req.body.user.googleid});
        newBanned.save();
        res.send({msg: 'successfully banned user'});
      });
    });
  })
});

router.post("/unban_user", auth.ensureRoot, (req, res)=> {
  BannedUser.deleteOne({googleid: req.body.user.googleid}).then((success) => {
    res.send({msg: 'success'});
  });
});

router.post("/new_review_from_draft", auth.ensureAdmin, (req, res) => {
  //req.body.state, req.body.draftId
  const data = {
    admin_name: req.user.name,
    admin_id: req.user._id,
    admin_googleid: req.user.googleid,
    admin_username: req.user.username,
    admin_picture: convpic('28', req.user.picture),
    type: req.body.state.media_type,
    title: req.body.state.title,
    season: parseInt(req.body.state.season), 
    episode: parseInt(req.body.state.episode),
    release_year: parseInt(req.body.state.release_year),
    rating: parseInt(req.body.state.rating),
    content: req.body.content,
    trailer_link: req.body.state.trailer_link,
    timestamp: Date.now(),
    img_url: req.body.state.img_url,
    director: req.body.state.director,
    runtime: parseInt(req.body.state.runtime),
    mpa_rating: req.body.state.mpa_rating,
    liked_users: [],
    likes: 0,
    genre: req.body.state.genre,
  };
  Draft.findByIdAndDelete(req.body.draftId).then((deleted) => {
    const newReview = new Review(data);
    newReview.save();
    socketManager.getIo().emit(req.body.state.media_type , data);
    res.send({msg: 'success'});
  });
});

router.post("/save_draft", auth.ensureAdmin, (req, res) => {
  const data = {
  title: req.body.state.title,
  season: req.body.state.season, 
  episode: req.body.state.episode,
  release_year: req.body.state.release_year,
  rating: req.body.state.rating,
  content: req.body.state.review_content,
  trailer_link: req.body.state.trailer_link,
  img_url: req.body.state.img_url,
  director: req.body.state.director,
  runtime: req.body.state.runtime, //in minutes
  mpa_rating: req.body.state.mpa_rating,
  genre: req.body.state.genre,
  };
  Draft.updateOne({_id: req.body.draftId}, data).then((success) => {
    res.send({msg: 'success'});
  });
});

router.post("/delete_draft", auth.ensureAdmin, (req, res) => {
  Draft.findByIdAndDelete(req.body.draftId).then((success)=>{
    res.send({msg: 'success'});
  })
});

router.get("/get_single_draft", auth.ensureAdmin, (req, res) => {
  Draft.findById(req.query.draftId).then((draft) => {
    res.send(draft);
  });
});

router.get("/get_user_drafts", auth.ensureAdmin, (req, res) => {
  Draft.find({admin_id: req.user._id}).then((results) => {
    res.send(results);
  });
});

router.post("/new_draft", auth.ensureAdmin, (req, res) => {
  const data = {
    admin_name: req.user.name,
    admin_id: req.user._id,
    admin_googleid: req.user.googleid,
    admin_username: req.user.username,
    admin_picture: convpic('28', req.user.picture),
    type: req.body.media_type,
    content: req.body.content,
    director: req.body.director,
    rating: req.body.rating,
    title: req.body.title,
    release_year: req.body.release_year,
    trailer_link: req.body.trailer_link,
    img_url: req.body.img_url,
    episode: req.body.episode,
    season: req.body.season,
    runtime: req.body.runtime,
    mpa_rating: req.body.mpa_rating,
    genre: req.body.genre,
  };
  const newDraft = new Draft(data);
  newDraft.save();
  res.send(data);
});

router.get("/comments_since_timestamp", auth.ensureRoot, (req, res) => {
  Comment.find({timestamp: {$gt: req.query.timestamp}}).sort({review_id: 1}).then((recent_comments) => {
    let data = [];
    let used = [];
    for (let i=0; i<recent_comments.length; i++){
      if (!used.includes(recent_comments[i].review_id)){
        used.push(recent_comments[i].review_id);
        data.push([recent_comments[i].review_id, 1, recent_comments[i].title]);
      }else{
        data[data.length-1][1]++;
      }
    }
    res.send({data: data});
  })
});

function capitalizeWord(word){
  return word[0].toUpperCase() + word.slice(1);
}
function randomNumber(length_needed){
  if (length_needed === 0){
    return '';
  }else{
    return Math.floor(Math.random() * (10 ** length_needed)).toString();
  }
}

function randomNoun(){
  const lengths = ['three', 'four', 'five', 'six', 'seven', 'eight'];
  const length_to_use = lengths[Math.floor(Math.random() * lengths.length)];
  const nouns_to_choose = Words.nouns[length_to_use];
  return nouns_to_choose[Math.floor(Math.random() * nouns_to_choose.length)];

}

function randomAdjective(){
  const lengths = ['three', 'four', 'five', 'six', 'seven', 'eight'];
  const length_to_use = lengths[Math.floor(Math.random() * lengths.length)];
  const adjs_to_choose = Words.adjs[length_to_use];
  return adjs_to_choose[Math.floor(Math.random() * adjs_to_choose.length)];
}

function createUsername(){
  const noun = randomNoun();
  const adj = randomAdjective();
  const number = randomNumber(16-noun.length-adj.length);
  return capitalizeWord(adj)+capitalizeWord(noun)+number;
}

router.post("/refresh_username", auth.ensureRoot, (req, res) => {
  const new_username = createUsername();
  User.updateOne({_id: req.body.user._id}, {username: new_username, username_lower: new_username.toLowerCase()}).then((s1) => {
    Comment.updateMany({user_id: req.body.user._id}, {username: new_username}).then((s2) => {
      if(req.body.user.admin){
        Review.updateMany({admin_id: req.body.user._id}, {admin_username: new_username}).then((s3) => {
          Announcement.updateMany({admin_id: req.body.user._id}, {admin_username: new_username}).then((s4) => {
            res.send({new_username: new_username});
          });
        });
      }else{
        res.send({new_username: new_username});
      }
    });
  });
});

router.get("/reviews_for_user", (req, res) => {
  Review.find({admin_id: req.query.userId}).sort({title: 1}).sort({season: 1}).sort({episode: 1}).then((results) => {
    res.send(results);
  });
});

router.post("/lock_user", auth.ensureRoot, (req, res) => {
  User.updateOne({_id: req.body.user._id}, {locked: !req.body.user.locked}).then((s) => {
    res.send({msg: 'success'});
  });
});

router.post("/edit_comment_permissions", auth.ensureRoot, (req, res) => {
  User.updateOne({_id: req.body.user._id}, {can_comment: !req.body.user.can_comment}).then((s) => {
    res.send({msg: 'success'});
  });
});

//FOR STATS PAGE:
router.get('/num_users', (req, res) => {
  User.find({}).then((users) => {
    res.send({total: users.length, admin: users.filter(elt => elt.admin === true).length});
  });
});

router.get('/num_reviews', (req, res) => {
  Review.find({}).sort({rating: 1}).then((all_reviews) => {
    let summed = 0;
    let likes = 0;
    let word_count = 0;
    let maxLikes = {likes: -1}
    for (const review of all_reviews){
      summed += review.rating;
      likes += review.likes;
      word_count += review.content.join(" ").split(" ").length;
      if (review.likes > maxLikes.likes){
        maxLikes = {_id: review._id, title: review.title, season: review.season, episode: review.episode, likes: review.likes};
      }
    }
    res.send({wordCount: word_count, total: all_reviews.length, likes: likes, avg_rating: Math.floor(summed/all_reviews.length), maxLikes: maxLikes, minRating: all_reviews[0], maxRating: all_reviews[all_reviews.length - 1]})
  });
});

router.get("/num_announcements", (req, res) => {
  Announcement.find({}).then((a) => {
    res.send({total: a.length});
  });
});

function find_mode(arr){
  let mapping = {};
  for (const elt of arr){
    if (mapping[elt.review_id] === undefined){
      mapping[elt.review_id] = 0;
    }
    mapping[elt.review_id] += 1;
  }
  let max_count = 0;
  let max_elt = '';
  for (const prop in mapping){
    if (mapping[prop] > max_count){
      max_count = mapping[prop];
      max_elt = `${prop.replace('\n', '')}`;
    }
  }
  return [max_elt, max_count];
}

router.get("/num_comments", (req, res) => {
  Comment.find({}, {review_id: 1}).then((all_comments) => {
    const max_review = find_mode(all_comments);
    Review.findOne({_id: max_review[0]}).then((review) => {
      res.send({total: all_comments.length, maxCommented: review, maxAmount: max_review[1], _id: max_review[0]});
    });
  });
});

//TEMPORARY ROUTE, UPDATE SOON!!!!!
router.post("/update_email", auth.ensureLoggedIn, (req, res) => {
  User.updateOne({ _id: req.user._id}, {email: req.body.email}).then((success) => {
    res.send({msg: "email updated!"})
  });
});

router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ error: "API path not found :(" });
});

module.exports = router;
