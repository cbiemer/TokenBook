//var fs = require('fs');
//var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.set('port', (process.env.PORT || 3000));

// app.use('/', express.static(path.join(__dirname, 'view')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


var MongoDB = require('./mongodb');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/login.html');
});

//MongoDB.createNewAgent('DocFast', '1581', 'Lasher1581', 'Facebook', '138378035102709', '484-870-6168', '23443');
//MongoDB.createNewAgent('iGO', '5790', 'Lasher5790', 'Facebook', '138378035102709', '484-870-6168', '34566');
//MongoDB.createNewAgent('DocFast', '7800', 'Lasher7800', 'Facebook', '138378035102709', '484-870-6168', '45212');


app.post('/getLinkedAccounts', function(req, res) {
  var userData = req.body;

  MongoDB.getLinkedAccounts('Facebook', '138378035102709', function(RSANumbers) {
	res.send(RSANumbers);
  });

});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

