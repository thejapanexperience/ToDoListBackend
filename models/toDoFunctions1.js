const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const filename = path.join(__dirname, '../data/todos.json');

exports.getAll = function (complete, cb) {
  if (complete === 'true' || complete === 'false'){
    console.log('complete is either true or false: ', complete)
  } else {
    console.log('no query for complete or incomplete');
  }
  // read from filenamejson parse on buffer
  // json parse on buffer
  fs.readFile(filename, (err, buffer) => {
    if (err) return cb(err);
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
        cb(null, completed);
      } else if (complete === 'false') {
        let completed = data.filter((todo) => {
          return todo.complete === false;
        })
        cb(null, completed);
      }
    } else {
      cb(null, data);
    }
  });
};

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

exports.write = function (newData, cb) {
  const json = JSON.stringify(newData);
  fs.writeFile(filename, json, cb);
};

exports.create = function (newItem, cb) {
  exports.getAll((err, items) => {
    if (err) return cb(err);
    newItem.id = uuid();
    newItem.complete = false
    items.push(newItem);
    exports.write(items, cb);
  });
};
