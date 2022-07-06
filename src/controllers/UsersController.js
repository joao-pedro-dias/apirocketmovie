const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;

        const checkUserExist = await knex("users")
        .where({ email })

        console.log(checkUserExist)

        if(checkUserExist == false){
            let hashPassword = await hash(password, 8);
    
            await knex("users").insert({
                name,
                email,
                password: hashPassword
            })
        } else if(checkUserExist){
            throw new AppError(`Este e-mail já está em uso`);
        }
        
        return response.status(201).json();
    }

    async update(request, response){
        const { email, name, password, old_password } = request.body;
        const user_id = request.user.id;
        const updateObject = {
            email,
            name,
            password
        }

        const user = (await knex("users")
        .where({ id: user_id }))[0];

        if(!user){
            throw new AppError("Usuário não encontrado!");
        }

        const userWithSameEmail = await knex("users")
        .where({ email: email });
        
        if(userWithSameEmail[0] && userWithSameEmail[0].id !== user_id){
            throw new AppError(`O e-mail informado já está em uso`);
        }

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);
            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere!");
            }

            let newPassword = await hash(password, 8);

            updateObject.password = newPassword;
        }

        await knex("users")
        .where( { id: user_id })
        .update(updateObject)

        return response.json("deu bom");
    }
}

module.exports = UsersController;
