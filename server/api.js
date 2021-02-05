const express = require("express");
//MODELS:
const User = require("./models/user");
const Review = require("./models/review");
const Comment = require("./models/comment");
const Announcement = require("./models/announcement");
//////////////////////
const BannedUser = require("./models/banneduser");
const auth = require("./auth");
const router = express.Router();
const socketManager = require("./server-socket");

const badwords = require('bad-words');
const filter = new badwords();

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
    res.send({msg: 'Deleted comment '+req.body.comment_id});
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

router.post("/update_review", auth.ensureAdmin, (req, res) => {
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
      const data = {
        user_name: req.user.name,
        user_id: req.user._id,
        user_googleid: req.user.googleid,
        review_id: req.body.review_id,
        content: req.body.content,
        picture: picture_to_use,
        title: req.body.title,
        timestamp: Date.now(),
        username: existing_user.username,
      };
      const newComment = new Comment(data);
      newComment.save();
      socketManager.getIo().emit(req.body.review_id, data);
      res.send(data);
    });
  }
});

router.post("/update_timestamp", auth.ensureLoggedIn, (req, res) => {
  User.updateOne({_id: req.user._id}, {last_login: Date.now()}).then((r) => {
    res.send({msg: 'success'});
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
    liked_users: [],
    likes: 0,
  };
  const newReview = new Review(data);
  newReview.save();
  socketManager.getIo().emit(req.body.media_type , data);
  res.send(data);
});

router.post("/update_profile", auth.ensureLoggedIn, (req, res) => {
  if (req.body.updated_uname){
    User.findOne({username: req.body.new_username}).then((existing_user) => {
      if (!existing_user || existing_user.googleid === req.body.googleid){
        User.updateOne({googleid: req.body.googleid}, 
          {username: req.body.new_username,
            currently_watching: req.body.new_c,
            favorite_movie: req.body.new_m,
            favorite_show: req.body.new_s,
            bio: req.body.bio,
          }).then((updated) => {
            Comment.updateMany({user_id: req.user._id}, {username: req.body.new_username}).then((_success) => {
              if (req.user.admin){
                Review.updateMany({admin_id: req.user._id}, {admin_username: req.body.new_username}).then((_success) => {
                  res.send({is_valid: true});
                })
              }else{
                res.send({is_valid: true});
              }
            });
          });
      }else{
        //invalid uname
        res.send({is_valid: false});
      }
    });
  }
  else{
    User.updateOne({googleid: req.body.googleid}, 
      {currently_watching: req.body.new_c,
        favorite_movie: req.body.new_m,
        favorite_show: req.body.new_s,
        bio: req.body.bio,
      }).then((updated) => {
        res.send({is_valid: true});
      });
  }
    
  
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
  const NUMBER_REVIEWS = 12;
  Review.find({}).sort({timestamp: -1}).then((sorted_reviews) => {
    const end_index = sorted_reviews.length > NUMBER_REVIEWS? NUMBER_REVIEWS : sorted_reviews.length;
    res.send(sorted_reviews.slice(0, end_index));
  });
});

router.get("/get_all_other_users", auth.ensureRoot, (req, res) => {
  User.find({_id: {$ne: req.user._id}}, {username: 1, name: 1, admin: 1, picture: 1, googleid: 1}).then((all_users) => {
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
      const newBanned = new BannedUser({name: req.body.user.name, googleid: req.body.user.googleid});
      newBanned.save();
      res.send({msg: 'successfully banned user'});
    });
  })
});

router.post("/unban_user", auth.ensureRoot, (req, res)=> {
  BannedUser.deleteOne({googleid: req.body.user.googleid}).then((success) => {
    res.send({msg: 'success'});
  });
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

router.get("/tempy", (req, res) => {
  Review.updateMany({}, {admin_picture: 'https://lh6.googleusercontent.com/-vspGCNx71Gk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucluwP4h8qJZNS_I7gqCBL3pWMp_-g/s28-c/photo.jpg'}).then((s) => {
    res.send({msg: 'success!'});
  })
});



router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ error: "API path not found :(" });
});

module.exports = router;
