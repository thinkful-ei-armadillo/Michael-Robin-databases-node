/* eslint-disable no-console */
'use strict';
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});


console.log('connection successful');
function searchTerm(string){
  knexInstance('shoppinglist')
    .select('*')
    .where('name', 'ILIKE',`%${string}%`)
    .then(result => console.log(result));
  
}
searchTerm('Dogs');

function pageNumber(number){
  const productsPerPage = 6;
  const offset = productsPerPage * ( number- 1);
  knexInstance('shoppinglist')
    .select('*')
    .limit(productsPerPage)
    .offset(offset)
    .then(results => console.log(results));
}
pageNumber(5);
function daysAgo(daysAgo){
  knexInstance('shoppinglist')
    .select('name', 'date_added')
    .count('date_added')
    .where('date_added', '<', knexInstance.raw('now() - \'?? days\'::INTERVAL', daysAgo))
    .from('shoppinglist')
    .groupBy('id')
    .then(results => console.log(results));
}
daysAgo(5);

function totalCost(){
  knexInstance('shoppinglist')
    .select('category')
    .sum('price')
    .groupBy('category')
    .then(results => console.log(results));
}

totalCost();