var mongoose = require('mongoose');
var Todo = require('./models/todo');

mongoose.connect('mongodb://localhost/todos');

// our app will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

console.log('removing old todos...');
Todo.remove({})
.then(function() {
  console.log('old todos removed');
  console.log('creating some new todos...');
  var groceries = new Todo({ title: 'groceries', completed: false });
  var feedTheCat = new Todo( { title: 'feed the cat', completed: true });
  // groceries.save();
  return Todo.create([groceries, feedTheCat]);
})
.then(function(savedTodos) {
  console.log('Todos have been saved');
  return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos...');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
});
