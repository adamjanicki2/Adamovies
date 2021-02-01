const express = require("express");
//MODELS:
const User = require("./models/user");
const Review = require("./models/review");
const Comment = require("./models/comment");

const auth = require("./auth");
const router = express.Router();
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }else{
    User.findOne({googleid: req.user.googleid}).then((existing) => {
      res.send(existing)
    });
  }
});



router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/get_single_user", (req, res) => {
  User.findById(req.query._id).then((user) => {
    res.send(user);
  });
});

router.get("/get_reviews", (req, res) => {
  Review.find(req.query).then((reviews) => {
    res.send(reviews);
  });
});

router.get("/get_single_review", (req, res) => {
  Review.findById(req.query.movieId).then((result) => {
    res.send(result);
  });
});

router.get("/get_comments_for_review", (req, res) => {
  Comment.find({review_id: req.query.review_id}).then((comments) => {
    res.send(comments);
  });
});

router.post("/new_comment", auth.ensureLoggedIn, (req, res) => {
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
      timestamp: Date.now(),
      username: existing_user.username,
    };
    const newComment = new Comment(data);
    newComment.save();
    socketManager.getIo().emit(req.body.review_id, data);
    res.send(data);
  });
});

router.post("/update_timestamp", (req, res) => {
  User.updateOne({googleid: req.user.googleid, name: req.user.name}, {last_login: Date.now()}).then((r) => {
    res.send({msg: 'success'});
  });
});

router.post("/new_review", auth.ensureAdmin, (req, res) => {
  const data = {
    admin_name: req.user.name,
    admin_id: req.user._id,
    admin_googleid: req.user.googleid,
    admin_username: req.user.username,
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
  };
  const newReview = new Review(data);
  newReview.save()
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

router.get("/recent_reviews", (req, res) => {
  Review.find({}).sort({timestamp: -1}).then((sorted_reviews) => {
    const end_index = sorted_reviews.length > 9? 9 : sorted_reviews.length;
    res.send(sorted_reviews.slice(0, end_index));
  });
});



router.get("/tempy", (req, res) => {
  // Review.updateMany({}, {season: 0, episode: 0}).then((success) => {
  //   res.send({mesg: 'success!'});
  // })
});

router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ error_msg: "API route not found" });
});

module.exports = router;
