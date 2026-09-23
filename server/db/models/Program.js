const knex = require("../knex");
const Recommend = require("./Recommend.js");
const Comment = require("./Comment.js");

class Program {
  constructor({
    id,
    name,
    bio,
    website_url,
    borough,
    organization_id,
    img_url,
    color,
    rating,
  }) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.websiteUrl = website_url;
    this.borough = borough;
    this.organizationId = organization_id;
    this.imgUrl = img_url;
    this.color = color;
    this.rating = rating;
  }

  static async list() {
    const query = "SELECT * FROM programs";
    const { rows } = await knex.raw(query);
    return rows.map((program) => new Program(program));
  }

  static async findById(id) {
    const query = "SELECT * FROM programs WHERE id = ?";
    const { rows } = await knex.raw(query, [id]);
    const program = rows[0];
    return program ? new Program(program) : null;
  }

  static async findByName(name) {
    const query = "SELECT * FROM programs WHERE name = ?";
    const { rows } = await knex.raw(query, [name]);
    const program = rows[0];
    return program ? new Program(program) : null;
  }

  static async create(
    name = "",
    bio = "",
    website_url = "",
    borough = "",
    organization_id = "",
    img_url = "",
    color = "",
    rating = null
  ) {
    const query = `
    INSERT INTO programs (name, bio, website_url, borough, organization_id, img_url, color, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
    `;
    try {
      const { rows } = await knex.raw(query, [
        name,
        bio,
        website_url,
        borough,
        organization_id,
        img_url,
        color,
        rating,
      ]);
      const program = rows[0];
      return program ? new Program(program) : null;
    } catch (e) {
      console.log(new Error(e));
      return new Error(e);
    }
  }

  static async update(id, name, bio, website_url, borough, img_url, color) {
    const oldData = await Program.findById(id);
    const query = `
    UPDATE programs
    SET name = ?, bio = ?, website_url = ?, borough = ?, img_url = ?, color =?
    WHERE id = ?
    RETURNING *
    `;
    try {

      const { rows } = await knex.raw(query, [
        name || oldData.name,
        bio || oldData.bio,
        website_url || oldData.websiteUrl,
        borough || oldData.borough,
        img_url || oldData.imgUrl,
        color || oldData.color,
        id,
      ]);
      const program = rows[0];
      return program ? new Program(program) : null;
    } catch(e) {
      return(e);
    }
  }

  static deleteAll() {
    return knex("programs").del();
  }

  static async deleteProgram(id) {
    const query = `
    DELETE FROM programs
    WHERE id = ?
    RETURNING *
    `;
    const { rows } = await knex.raw(query, [id]);
    const program = rows[0];
    return program ? new Program(program) : null;
  }

  static async getRecommends(id) {
    const inTable = await knex.raw("SELECT * FROM programs WHERE id = ?", [id]);
    if (!inTable.rows.length) return null;

    const query = "SELECT * FROM recommends WHERE program_id = ?";
    const { rows } = await knex.raw(query, [id]);
    return rows.map((rec) => new Recommend(rec));
  }

  static async getComments(id) {
    const inTable = await knex.raw("SELECT * FROM programs WHERE id = ?", [id]);
    if (!inTable.rows.length) return null;

    const query = `
    SELECT * FROM comments 
    WHERE program_id = ?
    ORDER BY id DESC`;
    const { rows } = await knex.raw(query, [id]);
    // return rows.map((com) => new Comment(com));
    return rows
  }
}

module.exports = Program;
