const PORT = 8000;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Flashcards = require('./models/flashcardFunctions');

const app = express();

// APP MIDDLEWARE

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ROUTES
// GET Intro
app.get('/', (req, res) => {
  const obj = {
    message: "Welcome to Richard's Flashcard App",
  };
  res.send(obj.message);
});

// GET Flashcards
app.get('/flashcards', (req, res) => {
  Flashcards.getAll((err, flashcards) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(flashcards);
  });
});

// GET Flashcards by ID and RandomOne by Category
app.get('/flashcards/:id', (req, res) => {
  Flashcards.getOne(req.params.id)
  .then((one) => { res.send(one); })
  .catch((error) => { res.status(400).send(error); })
});

// PUT Flashcards by ID
app.put('/flashcards/:id', (req, res) => {
  Flashcards.editOne(req.params.id, req.body)
  .then(() => res.send('Flashcard updated'))
  .catch((error) => { res.status(400).send(error); });
});

// DELETE Flashcards by ID
app.delete('/flashcards/:id', (req, res) => {
  Flashcards.deleteOne(req.params.id)
  .then(() => res.send('Flashcard deleted'))
  .catch((error) => { res.status(400).send(error); });
});

// POST new Flashcards
app.post('/flashcards', (req, res) => {
  Flashcards.create(req.body, err => {
    if (err) return res.status(400).send(err);
    res.send('New flashcard successfully created');
  });
});

app.listen(PORT, err => {
  console.log(err || `Express listening on port ${PORT}`)
});
