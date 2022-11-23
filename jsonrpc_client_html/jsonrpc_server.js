const jsonrpc = require('node-json-rpc');
const host = 'localhost', port = 9000;
// Creates an JSON-RPC server to listen to JSON-RPC method calls
const server = new jsonrpc.Server({host, port});
server.addMethod('sum', function (params, callback) {
 console.log("Method call params for 'sum': " + params);
 if (!Array.isArray(params))
 callback({code: -32602, message: "Invalid params"});
 else
 callback(null, params.reduce((acc, e) => acc += e, 0));
});
server.addMethod('system.listMethods', function (params, callback) {
 console.log("Method call params for 'system.listMethods': " + params);
 callback(null, ['sum']);
});
server.start(function (error) {
 if (error) throw error;
 else console.log(`JSON-RPC server listening on http://${host}:${port}`);
});