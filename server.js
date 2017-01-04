const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const {DB_USER, DB_PASSWORD, PORT} = require('./config');

const knex = require('knex')({
  client: 'pg',
  connection: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'recipify'
  }
});

// GET Request for recipes
app.get('/recipes', (req, res) => {
  knex.select('recipes.id', 'recipes.name', 'tags.tag', 'steps.description')
  .from('recipes')
  .join('recipe_tags', 'recipe_tags.recipe_id', 'recipes.id')
  .join('steps', 'steps.recipe_id', 'recipes.id')
  .then(function(rows) {
    let recipesObj = {};
    rows.forEach(row => {
      recipesObj[row.id] = {
        name: row.name,
        steps: [],
        tags: []
      }
      return recipesObj;
    });

  rows.forEach(row => {
    for (var prop in recipesObj) {
      if (row.id == prop) {
        // console.log(typeof recipesObj[row.id].steps);
        recipesObj[row.id].steps.push(row.description);
        recipesObj[row.id].tags.push(row.tag);
      }
    }
    return recipesObj;
  });

    res.status(200).json(recipesObj);
  });
});





app.listen(PORT, function() {
  console.log(`app listening on ${PORT}`);
});
