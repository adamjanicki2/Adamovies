const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socketManager = require("./server-socket");
const Words = require('./words.js');
const helpers = require("./helpers.js");

const CLIENT_ID = "577990730068-40v41c82e6bd14pj40khj7f2nbqhnasu.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const BannedUser = require("./models/banneduser");
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

function getOrCreateUser(user) {
  return BannedUser.findOne({ googleid: user.sub}).then((banned_user) => {
    if (banned_user){
      return {banned: true};
    }else{
      return User.findOne({ googleid: user.sub }).then((existingUser) => {
        if (existingUser) return existingUser;
        const newUname = helpers.createUsername();
        const newUser = new User({
          name: user.name,
          googleid: user.sub,
          picture: user.picture,
          email: user.email,
          admin: false,
          root: false,
          currently_watching: 'Not Set',
          favorite_movie: 'Not Set',
          favorite_show: 'Not Set',
          last_login: Date.now(),
          username: newUname,
          username_lower: newUname.toLowerCase(),
          bio: "Happy Adamovies user!",
          locked: false,
          can_comment: true,
        });
        return newUser.save();
      });
    }
  })
}

function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      if (user.banned){
        console.log('user banned');
        res.send({banned: true});
      }else{
        req.session.user = user;
        res.send(user);
      }
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "user not logged in" });
  }

  next();
}

function ensureAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "user not logged in" });
  }
  else if (req.user.admin === false){
    return res.status(401).send({ err: "user is not admin" });
  }
  
  next();
}

function ensureRoot(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "user not logged in" });
  }
  else if (req.user.root === false){
    return res.status(401).send({ err: "user is not root" });
  }
  
  next();
}
module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  ensureAdmin,
  ensureRoot,
};
