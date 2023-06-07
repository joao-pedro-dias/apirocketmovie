const knex = require("../database/knex");

class DishIngredientsController{
    async index(request, response){
        const user_id = request.user.id

        const ingredients = await knex("dish_ingredients")
        .where({ user_id })
        
        return response.json(ingredients);
    }
}

module.exports = DishIngredientsController;