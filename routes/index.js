var express = require('express'),
    router = express.Router(),
    Message = require('../model/message.js');

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
  
  Message.getAllMessages(function(err, result){
	  if(err){
	  	res.locals.error = err;
	  	res.end(err);
	  	return;
	  }
	  
	  console.log(result);
	  
	  try{
	  	res.render('index',{data:result, title:'主页'});
	  }
	  catch(e){
	  	res.end(e);
	  }
	  	
  });

  //res.render('index',{title:'主页'});
});

router.post('/', function(req, res){
	var userName = req.session.username,
		deTails = req.body['inputDetails'];
		
	var newMsg = new Message({
		username : userName,
		details : deTails
	});
	
	newMsg.save(function(err, result){
		if(err){
			res.locals.error = err;
			res.render('index', {title:'主页'});
			return;
		}
		
		res.redirect('/');
	});
});

module.exports = router;