const { isAuthorized } = require('../utils/auth-utils');
const User = require('../db/models/User');
const knex = require('../db/knex');

exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  // TODO: check if username is taken, and if it is what should you return?
  const isAvailable = await User.findByUsername(username);
  if (isAvailable !== null) {
    return res.sendStatus(400);
  }

  const user = await User.create(username, password);
  req.session.userId = user.id;

  res.send(user);
};

exports.listUsers = async (req, res) => {
  const users = await User.list();
  res.send(users);
};

exports.showUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.find(id);
  // console.log(user,id);
  if (!user) return res.sendStatus(404);

  res.send(user);
};

exports.updateUser = async (req, res) => {
  const { username, password, pfp_url } = req.body;
  const { id } = req.params;

  // Not only do users need to be logged in to update a user, they
  // need to be authorized to perform this action for this particular
  // user (users should only be able to change their own profiles)
  if (Number(id) !== Number(req.session.userId)) return res.sendStatus(403);

  const updatedUser = await User.update(id, username, password, pfp_url);
  if (!updatedUser) return res.sendStatus(404);
  res.send(updatedUser);
};

exports.getAllRecommends = async (req, res) => {
  const { id } = req.params;
  const recommends = await User.getAllRecommends(id);
  res.send(recommends);
};
