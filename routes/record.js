var express = require('express'),
    router = express.Router(),
	BinaryServer = require('binaryjs').BinaryServer,
	fs = require('fs'),
	wav = require('wav');
	
binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
  console.log("new connection");
	
  var fileWriter = new wav.FileWriter('demo2.wav', {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    stream.pipe(fileWriter);

    stream.on('end', function() {
      fileWriter.end();
    });
  });
});
    
router.get('/', function(req, res){
	res.render('recorder', {title:'Stream to wav'});
});

module.exports = router;
