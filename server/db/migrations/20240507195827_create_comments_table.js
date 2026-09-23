/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("comments", (table) => {
  table.increments("id").primary();
  table.integer("program_id");
  table.foreign('program_id').references("id").inTable("programs").onDelete('CASCADE');
  table.integer("user_id");
  table.integer("organization_id");
  table.foreign('user_id').references("id").inTable("users").onDelete('CASCADE');
  table.foreign('organization_id').references("id").inTable("organizations").onDelete('CASCADE');
  table.string("body").notNullable();
  table.date("date").notNullable();
  table.boolean('edited');
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('comments');
