const knex = require("../knex");
const authUtils = require("../../utils/auth-utils");
const Recommend = require("./Recommend");
const Comment = require("./Comment");

class User {
  #passwordHash = null; // a private property

  // This constructor is NOT how a controller creates a new user in the database.
  // Instead, it is used by each of the User static methods to hide the hashed
  // password of users before sending user data to the client. Since #passwordHash
  // is private, only the isValidPassword instance method can access that value.
  constructor({ id, username, password_hash, pfp_url }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.pfpUrl = pfp_url || "";
  }

  // This instance method takes in a plain-text password and returns true if it matches
  // the User instance's hashed password.
  isValidPassword = async (password) =>
    authUtils.isValidPassword(password, this.#passwordHash);

  static async list() {
    const query = `SELECT * FROM users`;
    const { rows } = await knex.raw(query);
    // use the constructor to hide each user's passwordHash
    return rows.map((user) => new User(user));
  }

  static async find(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const { rows } = await knex.raw(query, [id]);
    const user = rows[0];
    return user ? new User(user) : null;
  }

  static async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = ?`;
    const { rows } = await knex.raw(query, [username]);
    const user = rows[0];
    return user ? new User(user) : null;
  }

  static async create(username, password, pfp_url = "-1") {
    // hash the plain-text password using bcrypt before storing it in the database
    const passwordHash = await authUtils.hashPassword(password);

    const query = `INSERT INTO users (username, password_hash, pfp_url)
      VALUES (?, ?, ?) RETURNING *`;
    const { rows } = await knex.raw(query, [username, passwordHash, pfp_url]);
    const user = rows[0];
    return new User(user);
  }

  // this is an instance method that we can use to update
  static async update(id, username,password, pfp_url) {
    // dynamic queries are easier if you add more properties
    const previousData = await User.find(id);

    if(!previousData) {
      return null;
    }

    const passwordHash = password ? await authUtils.hashPassword(password) : null;
    const query = passwordHash
      ? `
        UPDATE users
        SET username = ?, password_hash = ?, pfp_url = ?
        WHERE id = ?
        RETURNING *
      `
      : `
        UPDATE users
        SET username = ?, pfp_url = ?
        WHERE id = ?
        RETURNING *
      `;
    const values = passwordHash
      ? [username || previousData.username, passwordHash, pfp_url || previousData.pfpUrl, id]
      : [username || previousData.username, pfp_url || previousData.pfpUrl, id];
    const { rows } = await knex.raw(query, values);
    const updatedUser = rows[0];
    return updatedUser ? new User(updatedUser) : null;
  }

  static async getAllRecommends(id) {
    const query = `SELECT * FROM recommends where user_id = ?`;
    const { rows } = await knex.raw(query, [id]);
    return rows.map((rec) => new Recommend(rec));
  }

  static async getAllComments(id) {
    const query = "SELECT * FROM comments where user_id = ?";
    const { rows } = await knex.raw(query, [id]);
    return rows.map((com) => new Comment(com));
  }

  static deleteAll() {
    return knex("users").del();
  }
}

module.exports = User;
