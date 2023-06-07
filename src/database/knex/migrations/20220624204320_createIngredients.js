exports.up = knex => knex.schema.createTable("dish_ingredients", table => {
    table.increments("id");
    table.integer("dish_id").references("id").inTable("dish").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
    table.text("name").notNullable();
});

exports.down = knex => knex.schema.dropTable("dish_ingredients");