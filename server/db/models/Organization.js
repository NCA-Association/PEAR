const knex = require("../knex");
const authUtils = require("../../utils/auth-utils");
const Program = require("./Program");

class Organization {
  #passwordHash = null;

  constructor({ id, username, password_hash, pfp_url }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.pfpUrl = pfp_url;
  }

  isValidPassword(password) {
    return authUtils.isValidPassword(password, this.#passwordHash);
  }

  static async list() {
    const query = "SELECT * FROM organizations";
    const { rows } = await knex.raw(query);
    return rows.map((org) => new Organization(org));
  }

  static async findById(id) {
    const query = "SELECT * FROM organizations WHERE id = ?";
    const { rows } = await knex.raw(query, [id]);
    const org = rows[0];
    return org ? new Organization(org) : null;
  }

  static async findByUsername(username) {
    const query = "SELECT * FROM organizations WHERE username = ?";
    const { rows } = await knex.raw(query, [username || '-1']);
    const org = rows[0];
    return org ? new Organization(org) : null;
  }

  static async create(username, password, pfp_url) {
    const passwordHash = await authUtils.hashPassword(password);
    const query = `INSERT INTO organizations (username, password_hash, pfp_url) 
    VALUES(?,?,?) 
    RETURNING *`;
    const { rows } = await knex.raw(query, [
      username,
      passwordHash,
      pfp_url,
    ]);
    const org = rows[0];
    return new Organization(org);
  }

  static async getProgramsOf(id) {
    const query = `
    SELECT * FROM programs
    WHERE organization_id = ?
    `;
    const { rows } = await knex.raw(query, [id]);
    return rows.map (program => new Program(program));
  }

  static async update(id, username, password, pfp_url) {
    const oldData = await Organization.findById(id);
    if (!oldData) return null;

    const passwordHash = password ? await authUtils.hashPassword(password) : null;
    const query = passwordHash
      ? `
        UPDATE organizations
        SET username = ?, password_hash = ?, pfp_url = ?
        WHERE id = ?
        RETURNING *
      `
      : `
        UPDATE organizations
        SET username = ?, pfp_url = ?
        WHERE id = ?
        RETURNING *
      `;
    const values = passwordHash
      ? [username || oldData.username, passwordHash, pfp_url || oldData.pfpUrl, id]
      : [username || oldData.username, pfp_url || oldData.pfpUrl, id];
    const { rows } = await knex.raw(query, values);
    const updatedOrg = rows[0];
    return updatedOrg ? new Organization(updatedOrg) : null;
  }

  static deleteAll() {
    return knex("organizations").del();
  }

  static async deleteAccount(id) {
    const programsQuery = `
    DELETE FROM programs
    WHERE organization_id = ?
    RETURNING *
    `;
    const { rows: programRows } = await knex.raw(programsQuery, [id]);

    await Promise.all(programRows.map(async (program) => {
      const commentQuery = `
      DELETE FROM comments
      WHERE program_id = ?
      `;
      await knex.raw(commentQuery, [program.id]);
    }));

    const organizationQuery = `
    DELETE FROM organizations
    WHERE id = ?
    `;

    await knex.raw(organizationQuery, [id]);
  }
}

module.exports = Organization;
