/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("programs", (table) => {
  table.increments("id").primary();
  table.string("name").notNullable();
  table.text("bio").notNullable();
  table.text("website_url").notNullable().unique();
  table.string("borough").notNullable();
  table.integer("organization_id");
  table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
  table.text("img_url").notNullable();
  table.string("color").notNullable();
  table.double("rating");
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('programs');
