const jsonrpc = require('node-json-rpc');
const host = 'localhost', port = 9000;
// Creates an JSON-RPC client. Passes the host information on where to make the JSON-RPC calls.
const client = new jsonrpc.Client({ host, port, path: '/'});
let i = 1, v = [];
setInterval(function () {
 v.push(i); i++;
 // Sends a method call to the JSON-RPC server
 client.call({"method":'sum', "params": v}, function (error, value) {
 console.log("Method response for 'sum': " + JSON.stringify(value));
 });
}, 1000);