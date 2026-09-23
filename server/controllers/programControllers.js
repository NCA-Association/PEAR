const knex = require("../db/knex");
const Program = require("../db/models/Program");
const { isAuthorized } = require("../utils/auth-utils");

exports.createProgram = async (req, res) => {
  const {
    name,
    bio,
    website_url,
    borough,
    organization_id,
    img_url,
    color,
    rating,
  } = req.body;

  if (!name || !bio || !website_url || !borough || !img_url || !color) return res.sendStatus(400);

  const isAvailable = (await Program.findByName(name)) === null;
  if (!isAvailable) return res.sendStatus(400);

  try {
    const program = await Program.create(
      name,
      bio,
      website_url,
      borough,
      organization_id,
      img_url,
      color,
      rating,
    );
    res.send(program)
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

exports.showProgram = async (req, res) => {
  const { id } = req.params;
  const program = await Program.findById(id);
  if (program === null) return res.sendStatus(404);

  res.send(program);
};

exports.updateProgram = async (req, res) => {
  const { id } = req.params;
  const { organization_id, name, bio, website_url, borough, img_url, color } = req.body;

  const program = await Program.findById(id);
  if (program === null) return res.sendStatus(404);
  if (Number(program.organizationId) !== Number(req.session.organizationId)) return res.sendStatus(403);

  const updatedProgram = await Program.update(id, name, bio, website_url, borough, img_url, color);
  if (updatedProgram === null) return res.sendStatus(404);

  res.send(updatedProgram);
};

exports.listAllPrograms = async (req,res) => {
  const programs = await Program.list();
  res.send(programs);
}
exports.getRecommends = async (req, res) => {
  const { id } = req.params;
  const recommends = await Program.getRecommends(id);
  res.send(recommends);
};

exports.getAllComments = async (req, res) => {
  const { id } = req.params;
  const comments = await Program.getComments(id);
  res.status(200);
  res.send(comments);
};

exports.deleteProgram = async (req,res) => {
  const {id} = req.params;
  const isAvailable = await Program.findById(id);
  if (isAvailable === null) return res.sendStatus(404);
  if (Number(isAvailable.organizationId) !== Number(req.session.organizationId)) return res.sendStatus(403);

  const comments = await knex.raw('DELETE FROM comments WHERE program_id = ?', [id]);
  const recommends = await knex.raw('DELETE FROM recommends WHERE program_id = ?', [id]);
  
  const program = await Program.deleteProgram(id);
  // console.log(program)
  if (!program) return res.sendStatus(404);
  res.send(program);
}
