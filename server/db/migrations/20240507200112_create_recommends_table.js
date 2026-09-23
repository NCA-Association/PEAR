/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("recommends", (table) => {
  table.increments("id").primary();
  table.integer("program_id");
  table.foreign('program_id').references("id").inTable("programs").onDelete('CASCADE');
  table.integer("user_id");
  table.foreign('user_id').references("id").inTable("users").onDelete('CASCADE');
  table.boolean('recommend');
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('recommends');
