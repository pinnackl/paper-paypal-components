var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/vendor", express.static(__dirname + '/vendor'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/pay', function (req, res) {
	// body...
})

http.listen(8000, function() {
  console.log('listening on *:8000');
});