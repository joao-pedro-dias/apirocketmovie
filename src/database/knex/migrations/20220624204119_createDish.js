exports.up = knex => knex.schema.createTable("dish", table => {
    table.increments("id");
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("category").notNullable();
    table.float("price").notNullable();
    table.integer("user_id").references("id").inTable("users").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dish");
