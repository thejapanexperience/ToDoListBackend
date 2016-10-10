const PORT = 8000;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Todos = require('./models/toDoFunctions');

const app = express();

// APP MIDDLEWARE

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MIDDLEWARE
//
// app.use((req, res, next) => {
//   console.log(req.url);
//   console.log(req.method);
//   console.log('req.query',req.query);
//   next();
// });

// ROUTES
// GET Intro
app.get('/', (req, res) => {
  const obj = {
    message: "Welcome to Richard's Todo App",
  };
  res.send(obj.message);
});

// GET all Todos or Todos by complete or not
app.get('/todos', (req, res) => {
  Todos.getAll(req.query.complete, (err, todos) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(todos);
  });
});

// PUT Todos by ID
app.put('/todos/:id', (req, res) => {
  Todos.editOne(req.params.id)
  .then(() => res.send('Todo completed'))
  .catch((error) => { res.status(400).send(error); });
});


// DELETE Todos by ID
app.delete('/todos/:id', (req, res) => {
  Todos.deleteOne(req.params.id)
  .then(() => res.send('Todo deleted'))
  .catch((error) => { res.status(400).send(error); });
});

// DELETE all Todos
app.delete('/todos', (req, res) => {
  Todos.deleteAll()
  .then(() => res.send('All todos deleted'))
  .catch((error) => { res.status(400).send(error); });
});

// POST new Todos
app.post('/todos', (req, res) => {
  Todos.create(req.body, err => {
    if (err) return res.status(400).send(err);
    res.send('New todo successfully created');
  });
});

app.listen(PORT, err => {
  console.log(err || `Express listening on port ${PORT}`)
});
