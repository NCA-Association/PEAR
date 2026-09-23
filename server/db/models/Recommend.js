const knex = require('../knex');

class Recommend {
  constructor({ id, program_id, user_id, recommend }) {
    this.id = id
    this.program_id = program_id;
    this.user_id = user_id;
    this.recommend = recommend;
  }

  static async list() {
    const query = "SELECT * FROM recommends";
    const { rows } = await knex.raw(query);
    return rows.map((recommend) => new Recommend(recommend));
  }

  static async findByProgramId(program_id) {
    const query = "SELECT * FROM recommends WHERE program_id = ?";
    const { rows } = await knex.raw(query, [program_id]);
    return rows.map((rec) => new Recommend(rec));
  }

  static async findByUserId(user_id) {
    const query = "SELECT * FROM recommends WHERE user_id = ?";
    const { rows } = await knex.raw(query, [user_id]);
    return rows.map((rec) => new Recommend(rec));
  }

  static async findById(id) {
    const query = 'SELECT * FROM recommends WHERE id = ?';
    const { rows } = await knex.raw(query, [id]);
    const recommend = rows[0];
    return recommend ? new Recommend(recommend) : null;
  }

  static async findSpecific(user_id, program_id) {
    const query = `SELECT * FROM recommends WHERE program_id = ? AND user_id = ?`;
    const { rows } = await knex.raw(query, [program_id, user_id]);
    const recommend = rows[0];
    return recommend ? new Recommend(recommend) : null;
  }

  static async create({ program_id, user_id,  recommend }) {
    const query = `
    INSERT INTO recommends(program_id, user_id, recommend)
    VALUES (?, ?, ?)
    RETURNING *`;
    const { rows } = await knex.raw(query, [program_id, user_id, recommend]);
    const recommendOutput = rows[0];
    return recommendOutput ? new Recommend(recommendOutput) : null;
  }

  static async update(newRec, id) {
    const query = `
    UPDATE recommends
    SET recommend = ?
    WHERE id = ?
    RETURNING *`;
    const { rows } = await knex.raw(query, [newRec, id]);
    const recommend = rows[0];
    return recommend ? new Recommend(recommend) : null;
  }

  static deleteAll() {
    return knex('recommends').del();
  }

  static async deleteRecommend(id) {
    const query = `
    DELETE FROM recommends
    WHERE id = ?`;
    const { rows } = await knex.raw(query, [id]);
    const recommend = rows[0];
    return recommend ? new Recommend(recommend) : null;
  }
}

module.exports = Recommend;
