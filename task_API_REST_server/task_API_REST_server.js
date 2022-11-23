/*jshint esversion: 6 */
const express = require('express');
const app = express();

// Import MW for parsing POST params in BODY
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import MW supporting Method Override with express
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const task_model = require('./task_model');

// CONTROLLER

// GET /, GET /tasks
const indexController = (req, res, next) => {
  let where = {};
  let active = false;
  if (req.query.active !== undefined) {
    active = JSON.parse(req.query.active);
  }
  if (active)
    where = {done: false};

  task_model.getAll(where)
  .then(tasks => {
    res.status(201).send({
      success: 'true',
      message: tasks.reduce((ac, task) => ac += `${task.id}\n${task.title}\n${task.done}`, ''),
    });
  })
  .catch(error => {next(Error(`DB Error:\n${error}`));});
};

// POST /tasks
const createController = (req, res, next) => {
  let {title, done} = req.body;
  if(!title)
    throw Error('title is required');

  task_model.add(title, done)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'task added successfully',
    });
  })
  .catch(error => {next(Error(`task not created:\n${error}`));});
};

// PUT /tasks/1
const updateController = (req, res, next) => {
  let id = Number(req.params.id);
  let {title, done} = req.body;
  if(!title)
    throw Error('title is required');
  if (done === undefined)
    done = false;

  task_model.update(id, title, done)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'task updated successfully',
    });
  })
  .catch(error => {next(Error(`task not updated:\n${error}`));});
};

// PATCH /tasks/1/switch
const switchController = (req, res, next) => {
  let id = Number(req.params.id);
  task_model.get(id)
  .then(task => {
    task_model.update(id, task.title, !task.done)
    .then(() => {
      res.status(201).send({
        success: 'true',
        message: 'task updated successfully',
      });
    })
    .catch(error => {next(Error(`task not updated:\n${error}`));});
  })
  .catch(error => {next(Error(`A DB Error has occurred:\n${error}`));});
};

// DELETE /tasks/1
const deleteController = (req, res, next) => {
  let id = Number(req.params.id);
  task_model.delete(id)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'task deleted successfully',
    });
  })
  .catch(error => {next(Error(`task not deleted:\n${error}`));});
};

// PUT /tasks/reset
const resetController = (req, res, next) => {
  task_model.reset()
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'tasks reseted successfully',
    });
  })
  .catch(error => {next(Error(`tasks not reseted:\n${error}`));});
};


const errorController = (err, req, res, next) => {
  if (req.originalUrl.includes('/api/'))
    res.status(409).send({
     success: 'false',
     message: err.toString(),
   });
  else
    res.status(409).send(err.toString());
};

// middleware to use for all requests
const logController = (req, res, next) => {
    // do logging
    console.log('req.method = ' + req.method);
    console.log('req.URL = ' + req.originalUrl);
    console.log('req.body = ' + JSON.stringify(req.body));
    console.log("======================");
    //console.log('req.path = ' + req.path);
    //console.log('req.route = ' + req.route);
    next(); // make sure we go to the next routes and don't stop here
  };


// ROUTER
app.use('*',                   logController);

app.get   (['/', '/tasks'],     indexController);
/* Add the 5 missing routes with the proper HTTP verbs that call to
   createController, updateController, switchController, deleteController
   and resetController functions.*/

app.use(errorController);

app.all('*', (req, res) =>
  res.send("Error: resource not found or method not supported")
);        


// Server started at port 8000
const PORT = 8000;
app.listen(PORT,
  () => {console.log(`Server running on port ${PORT}`);}
  );
