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
  .fullOuterJoin('recipe_tags', 'recipe_tags.recipe_id', 'recipes.id')
  .leftOuterJoin('tags', 'recipe_tags.tag_id', 'tags.id')
  .leftOuterJoin('steps', 'steps.recipe_id', 'recipes.id')
  .then(function(rows) {
    let recipesObj = {};
    rows.forEach(row => {
      console.log(row);
      if(!(row.id in recipesObj)) {
      recipesObj[row.id] = {
        name: row.name,
        steps: row.description ? [row.description] : [],
        tags: row.tag ? [row.tag] : []
      }
      return;
    }
    let steps = recipesObj[row.id].steps;
    let tags = recipesObj[row.id].tags;
    if (!steps.includes(row.description) || !tags.includes(row.tag)) {
      steps.push(row.description);
      tags.push(row.tag);
    }
  });



  // rows.forEach(row => {
  //   console.log(row);
  //   for (var id in recipesObj) {
  //     if (row.id == id) {
  //       let steps = recipesObj[id].steps;
  //       let tags = recipesObj[id].tags;
  //       if (!steps.includes(row.description) || !tags.includes(row.tag)) {
  //         steps.push(row.description);
  //         tags.push(row.tag);
  //       }
  //     }
  //   }
  //   return recipesObj;
  // });

    //res.status(200).json(recipesObj);
    res.json(Object.keys(recipesObj).map(key => recipesObj[key]));
  });
});





app.listen(PORT, function() {
  console.log(`app listening on ${PORT}`);
});
