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

router.post("/new_comment", auth.ensureLoggedIn, (req, res) => {
  res.send("NEW COMMENT");
  console.log("NEW COMMENT");
});

router.post("/new_review", auth.ensureAdmin, (req, res) => {
  res.send("NEW REVIEW");
  console.log("NEW REVIEW");
});

// router.get("/tempy", (req, res) => {
//   const dict = {
//     admin_name: req.user.name,
//   admin_id: req.user._id,
//   admin_googleid: req.user.googleid,
//   type: 'movie',
//   title: 'Batman Begins',
//   release_year: 2005,
//   rating: 89,
//   content: "Batman Begins is an awesome film.",
//   trailer_link: "https://www.youtube.com/watch?v=_Ogfr-CTzR8",
//   timestamp: Date.now(),
//   img_url: "https://www.iceposter.com/thumbs/MOV_cd0ef9f5_b.jpg",
//   director: "Christopher Nolan",
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
