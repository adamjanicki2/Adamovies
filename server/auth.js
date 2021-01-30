const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socketManager = require("./server-socket");


const CLIENT_ID = "577990730068-40v41c82e6bd14pj40khj7f2nbqhnasu.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  update_timestamp(user);
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.sub,
      picture: user.picture,
      admin: false,
      currently_watching: 'Not Set',
      favorite_movie: 'Not Set',
      favorite_show: 'Not Set',
      last_login: Date.now(),
      username: user.name,
    });
    return newUser.save();
  });
}

function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      update_timestamp(user);
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function update_timestamp(user) {
  User.updateOne({googleid: user.googleid, name: user.name}, {last_login: Date.now()});
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
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

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  ensureAdmin,
};
