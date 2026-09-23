const Recommend = require("../db/models/Recommend");
const User = require('../db/models/User');

exports.createRecommend = async (req, res) => {
  const { program_id, recommend } = req.body;
  const user_id = req.session.userId;

  if (!user_id || !program_id) return res.sendStatus(400);

  const isAvailable = await Recommend.findSpecific(user_id, program_id);
  if (isAvailable !== null) {
    return res.sendStatus(400);
  }

  const recommendMade = await Recommend.create({program_id, user_id, recommend});
  res.send(recommendMade);
};

exports.listAllRecommends = async (req, res) => {
  const recommends = await Recommend.list();
  res.send(recommends);
};

exports.listAllUserRecommends = async (req, res) => {
  const { id } = req.params;
  const recommends = await User.getAllRecommends(id);
  res.send(recommends);
};

exports.showRecommend = async (req, res) => {
  const { id } = req.params;
  const recommend = await Recommend.findById(id);
  res.send(recommend);
};

exports.updateRecommend = async (req, res) => {
  const { recommend } = req.body;
  const { id } = req.params;
  const existingRecommend = await Recommend.findById(id);
  if (!existingRecommend) return res.sendStatus(404);
  if (Number(existingRecommend.user_id) !== Number(req.session.userId)) return res.sendStatus(403);

  const updated = await Recommend.update(recommend, id);
  res.send(updated);
};

exports.checkIfExists = async (req,res) => {
  const {program, user} = req.query;
  if (!program || !user) return res.sendStatus(400);
  const recommend = await Recommend.findSpecific(+user,+program);
  res.send(recommend);
}
