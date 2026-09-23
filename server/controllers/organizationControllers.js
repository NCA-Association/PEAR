const Organization = require('../db/models/Organization');
const { isAuthorized } = require('../utils/auth-utils');

exports.createOrg = async (req, res) => {
  const { username, password, pfp_url } = req.body;

  const isAvailable = (await Organization.findByUsername(username)) === null;
  if (!isAvailable || !username || !password) return res.sendStatus(400);

  const organization = await Organization.create(username, password, pfp_url);
  req.session.organizationId = organization.id;
  // console.log(organization.id);
  // console.log(req.session.organizationId)

  res.send(organization);
};

exports.listOrganizations = async (req, res) => {
  const organizations = await Organization.list();
  res.send(organizations);
};

exports.showOrganization = async (req, res) => {
  const { id } = req.params;
  const organization = await Organization.findById(id);
  if (organization === null) return res.sendStatus(404);

  res.send(organization);
};

exports.updateOrganization = async (req, res) => {
  const { username, password, pfp_url } = req.body;
  const { id } = req.params;
  
  if (Number(id) !== Number(req.session.organizationId)) return res.sendStatus(403);

  const updatedOrganization = await Organization.update(id, username, password, pfp_url);
  if (updatedOrganization === null) return res.sendStatus(404);
  res.send(updatedOrganization);
};

exports.showOrganizationPrograms = async (req,res) => {
  const { id } = req.params;
  const programs = await Organization.getProgramsOf(id);
  res.send(programs);
};
