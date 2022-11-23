/*jshint esversion: 6 */

// Creates an JSON-RPC server to listen to JSON-RPC method calls
const jsonrpc = require('node-json-rpc');
const task_model = require('./task_model.js');

const host = 'localhost', port = 9000;
// Creates an XML-RPC server to listen to XML-RPC method calls
const server = new jsonrpc.Server({host, port});

server.addMethod('count', function (params, callback) {
  console.log("Method call params for 'count': " + params);
  params = (typeof params !== 'undefined') ?  params : [];
  where = (typeof params[0] !== 'undefined') ?  params[0] : {};
  task_model.count(where)
  .then(total => {callback(null, [total]);})
  .catch(err => {callback(err,null)});
 });

 server.addMethod('getAll', function (params, callback) {
  console.log("Method call params for 'getAll': " + params);


  params = (typeof params !== 'undefined') ?  params : [];
  where  = (typeof params[0] !== 'undefined') ? params[0] : {};
  order  = (typeof params[1] !== 'undefined') ? params[1] : {};
  offset = (typeof params[2] !== 'undefined') ? params[2] : 0;
  limit  = (typeof params[3] !== 'undefined') ? params[3] : 0;
  task_model.getAll(where, order, offset, limit)
  .then(tasks => {callback(null, tasks);})
  .catch(err =>{callback(err, null);});
 });

 server.addMethod('get', function (params, callback) {
  console.log("Method call params for 'get': " + params);
  // console.log("callback call params for 'get': " + callback);
  // console.log("Err call params for 'get': " + err);
  params = (typeof params !== 'undefined') ?  params : [];
  task_model.get(params[0])
  .then(task => {callback(null, task);})
  .catch(err =>{callback(err, null);});
 });

 server.addMethod('add', function ( params, callback) {
  console.log("Method call params for 'add': " + params);

  params = (typeof params !== 'undefined') ?  params : [];
  task_model.add(params[0], params[1])
  .then(() => {callback(null, "Task added");})
  .catch(err =>{callback(err,null);});
 });

 server.addMethod('update', function ( params, callback) {
  console.log("Method call params for 'update': " + params);
  params = (typeof params !== 'undefined') ? params : [];
  task_model.update(params[0], params[1], params[2])
    .then(() => {callback(null, "Task updated")})
    .catch(err => {callback(err, null);});
 });

 server.addMethod('delete', function ( params, callback) {
  console.log("Method call params for 'delete': " + params);
  params = (typeof params !== 'undefined') ? params : [];
  task_model.delete(params[0])
    .then(()=>{callback(null, "Task deleted")})
    .catch(err => {callback(err,null);});
 });

 server.addMethod('reset', function ( params, callback) {
  console.log("Method call params for 'reset': " + params);
  params = (typeof params !== 'undefined') ? params : [];
  task_model.reset()
    .then(()=>{callback(null, "Tasks reset")})
    .catch(err => {callback(err,null);});
 });



// .on('NotFound', function(method, params) { // Handle methods not found
//   console.log('Method ' + method + ' does not exist');
// })

// .on('count', function (err, params, callback) {
//   console.log("Method call params for 'count': " + params);
//   params = (typeof params !== 'undefined') ?  params : [];
//   where = (typeof params[0] !== 'undefined') ?  params[0] : {};
//   task_model.count(where)
//   .then(total => {callback(err, [total]);});
// })

// .on('getAll', function (err, params, callback) {
//   console.log("Method call params for 'getAll': " + params);
//   params = (typeof params !== 'undefined') ?  params : [];
//   where  = (typeof params[0] !== 'undefined') ? params[0] : {};
//   order  = (typeof params[1] !== 'undefined') ? params[1] : {};
//   offset = (typeof params[2] !== 'undefined') ? params[2] : 0;
//   limit  = (typeof params[3] !== 'undefined') ? params[3] : 0;
//   task_model.getAll(where, order, offset, limit)
//   .then(tasks => {callback(err, tasks);});
// })

// .on('get', function (err, params, callback) {
//   console.log("Method call params for 'get': " + params);
//   params = (typeof params !== 'undefined') ?  params : [];
//   task_model.get(params[0])
//   .then(task => {callback(err, task);});
// })

// .on('add', function (err, params, callback) {
//   console.log("Method call params for 'add': " + params);
//   params = (typeof params !== 'undefined') ?  params : [];
//   task_model.add(params[0], params[1])
//   .then(() => {callback(err, "Task added");});
// })

// .on('update', function (err, params, callback) {
//   console.log("Method call params for 'update': " + params);
//   params = (typeof params !== 'undefined') ? params : [];
//   task_model.update(params[0], params[1], params[2] 
//     .then(() => {callback(err, "Task updated")}));
// })

// .on('delete', function (err, params, callback) {
//   console.log("Method call params for 'delete': " + params);
//   params = (typeof params !== 'undefined') ? params : [];
//   task_model.delete(params[0])
//     .then(()=>{callback(err, "Task deleted")});
// })

// .on('reset', function (err, params, callback) {
//   console.log("Method call params for 'reset': " + params);
//   params = (typeof params !== 'undefined') ? params : [];
//   task_model.reset()
//     .then(()=>{callback(err, "Task deleted")});
// })

server.addMethod('system.listMethods', function (params, callback) {
  // console.log("Method call params for 'system.listMethods': " + params);
  console.log("Callbacks for 'getAll': " + callback);
  callback(null, ['count', 'getAll', 'get', 'add', 'update', 'delete', 'reset']);
})

server.addMethod('system.methodHelp', function (params, callback) {
  console.log("Method call params for 'system.methodHelp': " + params);
  params = (typeof params !== 'undefined') ?  params : [];
  var help = 'Unknown method';
  switch (params[0]) {
    case 'system.listMethods':
      help = "List of available methods";
      break;
    case 'system.methodHelp':
      help = "This method. It gives help of a method";
      break;
    case 'system.methodSignature':
      help = "It gives the signature of a method";
      break;
    case 'count':
  	  help = "Returns an array with the number of elements that meet the conditions (where)";
      break;
    case 'getAll':
      help = "Returns an array with (limit) elements that meet the conditions (where) bypassing the first (offset).";
      break;
    case 'get':
      help = "Returns the element identified by (id).";
      break;
    case 'add':
      help = "Adds a new element.";
      break;
    case 'update':
      help = "Updates the element identified by (id).";
      break;
    case 'delete':
      help = "Deletes the element identified by (id).";
      break;
    case 'reset':
      help = "Resets the element list to the initial values";
      break;
  }
  callback(null, help);  	
})

server.addMethod('system.methodSignature', function ( params, callback) {
  console.log("Method call params for 'system.methodSignature': " + params);
  params = (typeof params !== 'undefined') ?  params : [];
  var sign = 'Unknown method';
  switch (params[0]) {
    case 'system.listMethods':
      sign = "None";
      break;
    case 'system.methodHelp':
      sign = "Name of the method";
      break;
    case 'system.methodSignature':
      sign = "Name of the method";
      break;
    case 'count':
      sign = `
  where:  Object with conditions to filter the elements.
  Example: {a: 3, b: ['<', 5], c: ['includes', "A"]} computes a===3 && b<5 && c.includes("A")`;
      break;
    case 'getAll':
      sign = `
   where:  Object with conditions to filter the elements. Example:
           {a: 3, b: ['<', 5], c: ['includes', "A"]} computes a===3 && b<5 && c.includes("A")
   order:  Object with fields+booleans to sort the element. Example:
           {a: true, b: false} Ascending order by a field and descending order by b field.
   offset: First elements to bypass. 0 to start by the first.
   limit:  Number of elements to return. 0 to reach the last.`;
      break;
    case 'get':
      sign = "id: Element identification.";
      break;
    case 'add':
      sign = `
   title: String with the task title.
   done: Boolean explaining if the task is done or not.`;
      break;
    case 'update':
      sign = `
   id: Element identification.
   title: String with the task title.
   done: Boolean explaining if the task is done or not.`;
      break;
    case 'delete':
      sign = "id: Element identification.";
      break;
    case 'reset':
      sign = "None";
      break;
  }
  callback(null, sign);   
});

server.start(function (error) {
  if (error) throw error;
  else console.log(`JSON-RPC server listening on http://${host}:${port}`);
 });
