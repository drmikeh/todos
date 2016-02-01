# Steps

## Step 1 - Create the Project

1a. express generator
1b. npm install
1c. edit package.json and add nodemon
1d. npm install --save mongoose
1e. git init/add/commit

## Step 2 - Create a model and seeds file

2a. Create the model

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true }
});

module.exports = mongoose.model('Todo', TodoSchema);
```

2b. Create a `seeds.js` script

```javascript
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
  var feedTheCat = new Todo({ title: 'feedTheCat', completed: true });
  // return groceries.save();
  return Todo.create([groceries, feedTheCat]);
})
.then(function(savedTodo) {
  console.log('Todo has been saved');
  return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
});
```

## Step 3 - Create the routes and controller logic for our 7 RESTfull endpoints

3a. Add methodOverride to our project:

```bash
npm install --save method-override
```

Edit `app.js`:

```javascript
var methodOverride = require('method-override');

...

app.use(methodOverride('_method'));
```

3b. Create `routes/todos.js` with the following content:

```javascript
var express = require('express');
var router = express.Router();
var Todo = require('../models/todo');

// var TodoController = require('../controllers/todo');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  Todo.find({}, function(err, todos) {
    if (err) return next(err);
    res.render('todos/index', { todos: todos });
  });
});

// NEW
router.get('/new', function(req, res, next) {
  var todo = {
    title: '',
    completed: false
  };
  res.render('todos/new', { todo: todo, checked: '' });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    var checked = todo.completed ? 'checked' : '';
    res.render('todos/show', { todo: todo, checked: checked } );
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    var checked = todo.completed ? 'checked' : '';
    res.render('todos/edit', { todo: todo, checked: checked } );
  });
});

// CREATE
router.post('/', function(req, res, next) {
  var todo = {
    title: req.body.title,
    completed: req.body.completed ? true : false
  };
  Todo.create(todo, function(err, saved) {
    if (err) return next(err);
    res.redirect('/todos');
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  Todo.findById(req.params.id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    else {
      todo.title = req.body.title;
      todo.completed = req.body.completed ? true : false;
      todo.save(function(err) {
        if (err) return next(err);
        res.redirect('/todos');
      });
    }
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    res.redirect('/todos');
  });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var Todo = require('../models/todo');

// var TodoController = require('../controllers/todo');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

// INDEX
router.get('/', function(req, res, next) {
  Todo.find({}, function(err, todos) {
    if (err) return next(err);
    res.render('todos/index', { todos: todos });
  });
});

// NEW
router.get('/new', function(req, res, next) {
  var todo = {
    title: '',
    completed: false
  };
  res.render('todos/new', { todo: todo, checked: '' });
});

// SHOW
router.get('/:id', function(req, res, next) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    var checked = todo.completed ? 'checked' : '';
    res.render('todos/show', { todo: todo, checked: checked } );
  });
});

// EDIT
router.get('/:id/edit', function(req, res, next) {
  Todo.findById(req.params.id, function (err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    var checked = todo.completed ? 'checked' : '';
    res.render('todos/edit', { todo: todo, checked: checked } );
  });
});

// CREATE
router.post('/', function(req, res, next) {
  var todo = {
    title: req.body.title,
    completed: req.body.completed ? true : false
  };
  Todo.create(todo, function(err, saved) {
    if (err) return next(err);
    res.redirect('/todos');
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  Todo.findById(req.params.id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    else {
      todo.title = req.body.title;
      todo.completed = req.body.completed ? true : false;
      todo.save(function(err) {
        if (err) return next(err);
        res.redirect('/todos');
      });
    }
  });
});

// DESTROY
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(makeError(res, 'Document not found', 404));
    res.redirect('/todos');
  });
});

module.exports = router;
```

## Step 5 - Create the views for `index`, `show`, `new`, and `edit`

5a. `views/todos/partials/head`:

```html
<meta charset="UTF-8">
<title>TODOs</title>

<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="/stylesheets/style.css">
```

5b. `views/todos/partials/header`:

```html
<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">
        <span class="glyphicon glyphicon glyphicon-tree-deciduous"></span>EJS Is Fun
      </a>
    </div>

    <ul class="nav navbar-nav">
      <li><a href="/">Home</a></li>
      <li><a href="/todos">TODOs</a></li>
    </ul>
  </div>
</nav>
```

5c. `views/todos/partials/footer`:

```html
<p class="text-center text-muted">&copy; Copyright 2016 ATLANTA WDI Cohort #5</p>
```


5d. `views/todos/index.ejs`:

```html
<!doctype html>
<html lang="en">
<head>
  <% include ../partials/head %>
</head>

<body class="container-fluid">
  <header>
    <% include ../partials/header %>
  </header>

  <main>
    <div>
      <h1>TODOs:</h1>

      <% todos.forEach(function(todo) { %>
      <h4>
        <form method="POST" action="/todos/<%= todo._id %>?_method=DELETE">
          <a href="/todos/<%= todo._id %>"><%= todo.title + ' - ' + todo.completed %></a>
          <button type="submit" class="btn btn-xs btn-danger">Delete</button>
        </form>
      </h4>
      <% }) %>
    </div>
    <a href="/todos/new" class="btn btn-primary">New</a>
  </main>

  <footer>
    <% include ../partials/footer %>
  </footer>
</body>
</html>
```

5e. `views/todos/show.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <% include ../partials/head %>
</head>

<body class="container-fluid">
  <header>
    <% include ../partials/header %>
  </header>

  <main>
    <div>
      <h3>SHOW</h3>
      <p><b>Title: </b><%= todo.title %></p>
      <p><b>ID: </b><%= todo._id %></p>
      <p><b>Completed: </b><%= todo.completed %></p>
    </div>
    <a href="/todos" class="btn btn-primary">Back</a>
    <a href="/todos/<%= todo._id %>/edit" class="btn btn-danger">Edit</a>
  </main>

  <footer>
    <% include ../partials/footer %>
  </footer>
</body>
</html>
```

5f. `views/todos/_form.ejs`:

```html
<div class="form-group">
  <label for="title">Title</label>
  <input type="text"
         class="form-control"
         id="title"
         name="title"
         value="<%= todo.title %>">
</div>

<div class="form-group">
  <label for="completed">Completed</label>
  <input type="checkbox"
         class="form-control"
         id="completed"
         name="completed"
         <%= checked %> >
</div>
```

5g. `views/todos/new.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <% include ../partials/head %>
</head>

<body class="container-fluid">
  <header>
    <% include ../partials/header %>
  </header>

  <main>
    <div>
      <h3>NEW</h3>
      <form class="todo-form" action="/todos" method="post">
        <% include ../partials/todo-form %>
        <a href="/todos" class="btn btn-primary">Back</a>
        <button type="submit" class="btn btn-success">Save</button>
      </form>
    </div>
  </main>

  <footer>
    <% include ../partials/footer %>
  </footer>
</body>
</html>
```

5h. `views/todos/edit.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <% include ../partials/head %>
</head>

<body class="container-fluid">
  <header>
    <% include ../partials/header %>
  </header>

  <main>
    <div>
      <h3>EDIT:</h3>
      <form class="todo-form" method="POST" action="/todos/<%= todo._id %>?_method=PUT">
        <% include ../partials/todo-form %>
        <a href="/todos/<%= todo._id %>" class="btn btn-primary">Back</a>
        <button type="submit" class="btn btn-success">Save</button>
      </form>
    </div>
  </main>

  <footer>
    <% include ../partials/footer %>
  </footer>
</body>
</html>
```
