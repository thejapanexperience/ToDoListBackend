const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filename = path.join(__dirname, '../data/flashcards.json');

exports.getAll = function (cb) {
  // read from filenamejson parse on buffer
  // json parse on buffer
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      var data = [];
    }
    cb(null, data);
  });
};

exports.getOne = (id) => new Promise((res, rej) => {
  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      var data = [];
      return rej('failed');
    }
    let categories = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].Category) {
        categories.push(data[i].Category)
      }
    }
    categories.sort()
    for (var i = 0; i < categories.length; i++) {
      while (categories[i] === categories[i+1]) {
        categories.splice(i+1)
      }
    }
    console.log('categories: ', categories)

    let one
    id = id.split(',')
    console.log('id: ', id)
    if (categories.indexOf(id[0]) > -1) {
      id = id[Math.floor(Math.random()*id.length)]
      console.log('id: ', id)
      var random = data.filter((flashcard) => {
        return flashcard.Category === id
      })
      one = random[Math.floor(Math.random()*random.length)]
      console.log('one: ', one)
      one = `Question ${one.Question}
Use ID to check the answer: ${one.id}.`
      console.log('one: ', one)
    } else {
      console.log('id: ', id)
      id = id[0]
      console.log('id: ', id)
      one = data.filter((flashcard) => {
        return flashcard.id === id
        console.log('one: ', one)
      })
      one = one[0]
    }
    console.log('one: ', one);
    res(one);
  });
});

exports.editOne = (id, newData) => new Promise((res, rej) => {
  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      var data = [];
      return rej('failed');
    }
    let index;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        index = i
      }
    }
    data[index].Category = newData.Category;
    data[index].Question = newData.Question;
    data[index].Answer = newData.Answer;
    let json = JSON.stringify(data);
    fs.writeFile(filename, json, (err) => {
      if (err) throw err;
    });
    res();
  });
});

exports.deleteOne = (id) => new Promise((res, rej) => {
  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch(e) {
      var data = [];
      return rej('failed');
    }
    let index
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        index = i;
      }
    }
    data.splice(index, 1);
    const json = JSON.stringify(data);
    fs.writeFile(filename, json, (err) => {
      if (err) throw err;
    });
    res();
  });
});

exports.write = function (newData, cb) {
  const json = JSON.stringify(newData);
  fs.writeFile(filename, json, cb);
};

exports.create = function (newItem, cb) {
  exports.getAll((err, items) => {
    if (err) return cb(err);
    newItem.id = uuid();
    items.push(newItem);
    exports.write(items, cb);
  });
};
