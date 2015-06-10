var app = require('./server-config.js');

var port = process.env.PORT || 4568;

console.log(process.env.NODE_ENV);
app.listen(port);
console.log('Server now listening on port ' + port);
