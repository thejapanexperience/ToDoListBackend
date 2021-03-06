const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filename = path.join(__dirname, '../data/todos.json');

exports.getAll = (complete) => new Promise ((res, rej) => {
  console.log('complete: ', complete)
  if (complete === 'true' || complete === 'false'){
    console.log('complete is either true or false: ', complete)
  } else {
    console.log('no query for complete or incomplete');
  }

  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch (e) {
      var data = [];
    }

    if(complete === 'true' || complete === 'false'){
      if (complete === 'true'){
        let completed = data.filter((todo) => {
          return todo.complete === true;
        })
        res(completed);
      } else if (complete === 'false') {
        let completed = data.filter((todo) => {
          return todo.complete === false;
        })
        res(completed);
      }
    } else {
      console.log('data: ', data)
      res(data);
    }
  })
});


exports.editOne = (id) => new Promise((res, rej) => {
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
    data[index].complete = true;
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

exports.deleteAll = () => new Promise((res, rej) => {
  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch(e) {
      var data = [];
      return rej('failed');
    }
    data = []
    const json = JSON.stringify(data);
    fs.writeFile(filename, json, (err) => {
      if (err) throw err;
    });
    res();
  });
});

exports.write = (newData) => new Promise ((res, rej) => {
  if (err) return rej(err);
  const json = JSON.stringify(newData);
  s.writeFile(filename, json, (err) => {
    if (err) throw err;
  });
  res();
})

exports.create = (newItem) => new Promise ((res, rej) => {
  fs.readFile(filename, (err, buffer) => {
    if (err) return rej(err);
    try {
      var data = JSON.parse(buffer);
    } catch(e) {
      var data = [];
      return rej('failed');
    }
    newItem.id = uuid();
    newItem.complete = false
    data.push(newItem);
    const json = JSON.stringify(data);
    fs.writeFile(filename, json, (err) => {
      if (err) throw err;
    });
    res();
  });
});
