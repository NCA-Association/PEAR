const Organization = require('../db/models/Organization');
const User = require('../db/models/User');

// This controller takes the provided username and password and finds
// the matching user in the database. If the user is found and the password
// is valid, it adds the userId to the cookie (allowing them to stay logged in)
// and sends back the user object.
exports.loginUser = async (req, res) => {
  const { username, password } = req.body; // the req.body value is provided by the client

  const user = await User.findByUsername(username);
  if (!user) return res.sendStatus(404);

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) return res.sendStatus(401);

  req.session.userId = user.id;
  req.session.organization = false;
  res.send(user);
};

exports.logInOrganization = async (req, res) => {
  const { username, password } = req.body;

  const organization = await Organization.findByUsername(username);
  if (!organization) return res.sendStatus(404);

  const isPasswordValid = await organization.isValidPassword(password);
  if (!isPasswordValid) return res.sendStatus(401);

  req.session.organizationId = organization.id;
  req.session.organization = true;
  res.send(organization);
};

// This controller sets `req.session` to null, destroying the cookie
// which is the thing that keeps them logged in.
exports.logoutUser = (req, res) => {
  req.session = null;
  res.sendStatus(204);
};

// This controller returns 401 if the client is NOT logged in (doesn't have a cookie)
// or returns the user based on the userId stored on the client's cookie
exports.showMe = async (req, res) => {
  if (!req.session.userId && !req.session.organizationId) return res.sendStatus(401);

  const user = await User.find(req.session.userId) || await Organization.findById(req.session.organizationId);
  res.send(user);
};

exports.showOrganization = async (req, res) => {
  if (!req.session.organizationId) return res.sendStatus(401);

  const organization = await Organization.findById(req.session.organizationId);
  res.send(organization);
};

exports.getLoggedIn = async (req,res) => {
  if (req.session.organizationId) {
    return res.send([true,req.session.organizationId])
  }
  if (req.session.userId) {
    return res.send([false,req.session.userId]);
  }
  return res.send([false,-1]);
}
