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
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
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
  const data = {
    user_name: req.user.name,
    user_id: req.user._id,
    user_googleid: req.user.googleid,
    review_id: req.body.review_id,
    content: req.body.content,
  };
  const newComment = new Comment(data);
  newComment.save();
  res.send(data);
});

router.post("/new_review", auth.ensureAdmin, (req, res) => {
  res.send("NEW REVIEW");
  console.log("NEW REVIEW");
});

// router.get("/tempy", (req, res) => {
//   const dict = {
//   admin_name: req.user.name,
//   admin_id: req.user._id,
//   admin_googleid: req.user.googleid,
//   type: 'show',
//   title: 'Mr. Robot',
//   release_year: 2015,
//   rating: 98,
//   content: "Mr. Robot is an incredible, show; one of my favorites! The mind-blowing factor of this show is just off the charts, which is part of why I love it so much.",
//   trailer_link: "https://www.youtube.com/watch?v=U94litUpZuc",
//   timestamp: Date.now(),
//   img_url: "https://i.pinimg.com/736x/e2/d7/cb/e2d7cb2140fc60469092c0c3a471a63e.jpg",
//   director: "Sam Esmail",
//   };
//   const n = new Review(dict);
//   n.save();
//   res.send('success');
// });

router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ error_msg: "API route not found" });
});

module.exports = router;
