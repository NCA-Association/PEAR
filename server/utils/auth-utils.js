const bcrypt = require('bcrypt');

/** Take in a user password and return a hashed password, undefined if error
 * @param {string} password Plaintext password
 * @param {number} saltRounds How many salt rounds to use
 * @returns {Promise<string|undefined>} Hashed password
 */
const hashPassword = async (password, saltRounds = 8) => bcrypt
  .hash(password, saltRounds)
  .catch(() => undefined);

/** Check if a given password matches a given hash, returns a bool, or undefined if error
 * @param {string} password Plaintext password
 * @param {string} hash Salted hash
 * @returns {Promise<true|false|undefined>} Bool of whether password matches hash
 */
const isValidPassword = async (password, hash) => bcrypt
  .compare(password, hash)
  .catch(() => undefined);

const isAuthorized = (userId, session) => {
  // console.log(userId,session.organizationId, session.userId)
  if (!userId || !session || !(session.userId || session.organizationId)) return false;
  return Number(userId) === Number(session.userId) || Number(userId) === Number(session.organizationId);
};

module.exports = {
  hashPassword,
  isValidPassword,
  isAuthorized,
};
