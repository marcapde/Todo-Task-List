/*jshint esversion: 6 */
const xmlrpc = require('xmlrpc');

// Creates an XML-RPC client. Passes the host information on where to make the XML-RPC calls.
const client = xmlrpc.createClient({host: 'localhost', port: 9000, path: '/'});

const task_titles = ['Conference', 'Talk', 'Exam', 'Execise', 'Practice'];
let i = 0;
console.log("Wait ...");

setInterval(function () {
  client.methodCall('add', [task_titles[i]], function (error, value) {
    if (error)
      console.error('Result: ' + error);
    else {
      i = i === 4 ? 0 : i+1;
      console.log("Method response for 'add': " + JSON.stringify(value));
      client.methodCall('getAll', [], function (error, value) {
        if (error)
          console.error('Result: ' + error);
        else
          console.log("Method response for 'getAll': " + JSON.stringify(value));
      });
    }
  });
}, 5000);