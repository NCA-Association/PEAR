const Comment = require("../db/models/Comment");
const User = require("../db/models/User");

exports.createComment = async (req, res) => {
  const { programId, body, time } = req.body;
  const userId = req.session.userId || null;
  const organizationId = req.session.organizationId || null;
  // console.log(programId,userId,body,time);

  if (!programId || !body || !time || (!userId && !organizationId)) {
    return res.sendStatus(400);
  }

  const comment = await Comment.create({program_id:programId, user_id:userId, organization_id: organizationId,  body, date:time});
  res.status(200);
  res.send(comment);
};

exports.getAllComments = async (req, res) => {
  const comments = await Comment.list();
  res.send(comments);
};

exports.showComment = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  res.send(comment);
};

exports.updateComment = async (req, res) => {
  const { body } = req.body;
  const {id} = req.params;
  const existingComment = await Comment.findById(id);
  if (!existingComment) return res.sendStatus(404);
  const ownsComment = (existingComment.user_id && Number(existingComment.user_id) === Number(req.session.userId))
    || (existingComment.organization_id && Number(existingComment.organization_id) === Number(req.session.organizationId));
  if (!ownsComment) return res.sendStatus(403);

  const comment = await Comment.update(id, body);
  res.send(comment);
};

exports.getAllCommentsOfUser = async (req, res) => {
  const { id } = req.params;
  const comments = await User.getAllComments(id);
  res.send(comments);
};

exports.deleteComment = async (req,res) => {
  const {id} = req.params;
  const existingComment = await Comment.findById(id);
  if (!existingComment) return res.sendStatus(404);
  const ownsComment = (existingComment.user_id && Number(existingComment.user_id) === Number(req.session.userId))
    || (existingComment.organization_id && Number(existingComment.organization_id) === Number(req.session.organizationId));
  if (!ownsComment) return res.sendStatus(403);

  const comment = await Comment.deleteComment(id);
  res.send(comment);
};
