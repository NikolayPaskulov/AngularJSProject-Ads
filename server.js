/**
 * Created by abhiroop on 5/6/14.
 */
var express = require('express'),
  serverStatic = require('serve-static');

var app = express();

app.use('/', serverStatic(__dirname + '/app'));

var port = 8000;
app.listen(port);
console.log('Please go to http://localhost:' + port);

