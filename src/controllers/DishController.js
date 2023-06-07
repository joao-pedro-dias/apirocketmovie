const knex = require("../database/knex");

class DishController{
    async create(request, response){
        const { title, description, ingredients, category, price } = request.body;
        const user_id = request.user.id;

        const user = await knex("users")
        .where({ id: user_id, isAdmin: 1 })
        .first();
      
        if (!user) {
            // Usuário não é administrador, retorne um erro ou uma resposta com status proibido
            return response.status(403).json({ error: "Acesso negado." });
        }

        const dish_id = await knex("dish").insert({
            title,
            description,
            category,
            price,
            user_id
        });

        const ingredientsInsert = ingredients.map(name => {
            return{
                dish_id,
                name,
                user_id
            }
        });

        await knex("dish_ingredients").insert(ingredientsInsert);

        response.status(201).json(); //padrão do status create
    }

    async show(request, response){

        const { id } = request.params;
        const dish = await knex("dish").where({ id }).first();
        const user_id = dish.user_id;
        const user = await knex("users").where({ id: user_id }).first();
        const dish_ingredients = await knex("dish_ingredients").where({ dish_id: id }).orderBy("name");
        
            return response.json({
            ...dish,
            user_name: user.name, // adiciona o nome do usuário aqui
            dish_ingredients
        });
        
    }

    async delete(request, response){
        const { id } = request.params;
        const user_id = request.user.id;

        const user = await knex("users")
        .where({ id: user_id, isAdmin: 1 })
        .first();
      
        if (!user) {
            // Usuário não é administrador, retorne um erro ou uma resposta com status proibido
            return response.status(403).json({ error: "Acesso negado." });
        }

        await knex("dish").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title, dish_ingredients } = request.query;
        const user_id = request.user.id;

        let dish;

        if(dish_ingredients){
            const filterIngredients = dish_ingredients.split(',').map(dish_ingredient => dish_ingredient.trim());

            dish = await knex("dish_ingredients")
            .select([
                "dish.id",
                "dish.title",
                "dish.user_id",
            ])
            .where("dish.user_id", user_id)
            .whereLike("dish.title", `%${title}%`)
            .whereIn("name", filterIngredients)
            .innerJoin("dish", "dish.id", "dish_ingredients.dish_id")
            .orderBy("dish.title")
            
        } else if (title){
            dish = await knex("dish")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        } else {
            dish = await knex("dish")
            .where({ user_id })
            .orderBy("title");
        }

        const userIngredients = await knex("dish_ingredients").where({ user_id });
        const dishWithIngredients = dish.map(dish => {
            const ingredients = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return{
                ...dish,
                ingredients
            }
        })

        return response.json(dishWithIngredients);
    }

    async update(request, response) {
        const { id } = request.params; // Obtém o ID do prato a ser atualizado
        const { title, description, ingredients, category, price } = request.body;
        const user_id = request.user.id;

        const user = await knex("users")
        .where({ id: user_id, isAdmin: 1 })
        .first();
      
        if (!user) {
            // Usuário não é administrador, retorne um erro ou uma resposta com status proibido
            return response.status(403).json({ error: "Acesso negado." });
        }
    
        try {
          // Atualiza as informações do prato na tabela "dish"
          await knex("dish")
            .where({ id })
            .update({
                title,
                description,
                category,
                price,
            });
    
          // Remove os ingredientes existentes do prato na tabela "dish_ingredients"
            await knex("dish_ingredients")
            .where({ dish_id: id })
            .del();
    
          // Insere os novos ingredientes na tabela "dish_ingredients"
            const ingredientsInsert = ingredients.map((name) => ({
                dish_id: id,
                user_id,
                name,
            }));
    
            await knex("dish_ingredients").insert(ingredientsInsert);
    
            response.status(200).json({ message: "Prato atualizado com sucesso." });
        } catch (error) {
            response.status(500).json({ error: "Erro ao atualizar o prato." });
        }
    }
}

module.exports = DishController;