const ShoppingListService = {
    getAllItems(knex){
        return knex
            .select('*')
            .from('shoppinglist')
    },
    getById(knex, id){
        return knex
            .select('*')
            .from('shoppinglist')
            .where('id', id)
            .first()
    },
    deleteItem(knex, id){
        return knex('shoppinglist')
            .where({id})
            .delete()
    },
    updateItem(knex, id, newFields){
        return knex('shoppinglist')
            .where({id})
            .update(newFields)
    },
    insertItem(knex, newItem){
        return knex
            .insert(newItem)
            .into('shoppinglist')
            .returning('*')
            .then(rows => rows[0])
    },
}

module.exports = ShoppingListService;