var express = require('express'),
     router = express.Router(),
     BinaryServer = require('binaryjs').BinaryServer,
     fs = require('fs'),
     wav = require('wav'),
     Audio = require('../model/audio.js');

bs = BinaryServer({port: 9001});

bs.on('connection', function(client){
  client.on('stream', function(stream, meta){
    switch(meta.event) {
      // list avaiable audios
      case 'list':
        Audio.list(stream, meta);
        break;
      // select for one audio
      case 'select':
        Audio.select(client, meata);
        break;
      // perform a upload
      case 'upload':
      default:
        Audio.upload(stream, meta);
    }
  });
});

router.get('/', function(req, res) {
  if(req.cookies.islogin)
  { 
         console.log('cookies:' + req.cookies.islogin);
       req.session.username = req.cookies.islogin;
  }  

  if(req.session.username)
  {    
        console.log('session:' + req.session.username);
        res.locals.username = req.session.username;      
  }
  else
  {
        res.redirect('/login');
        return;    
  }
  res.render('recorder_download',{title:'download recorder'});
});

module.exports = router;