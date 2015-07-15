var express = require('express'),
	router = express.Router(),
	User = require('../model/user.js'),
	crypto = require('crypto'),
	TITLE_REG = 'Register';
	
router.get('/', function(req, res){
	res.render('reg', {title: TITLE_REG});
});

router.post('/', function(req, res){
	var userName = req.body['txtUserName'],
		userPwd = req.body['txtUserPwd'],
		md5 = crypto.createHash('md5');
		
	userPwd = md5.update(userPwd).digest('hex');

	var newUser = new User({
		username: userName,
		userpass: userPwd
	});
	
	//Check if the username existed.
	User.getUserNumByName(newUser.username, function(err, results){
		if(results != null && results[0]['num'] > 0){
			err = 'User already existed';
		}
		
		if(err){
			res.locals.error = err;
			res.render('reg', { title: TITLE_REG});
			return;
		}
		
		newUser.save(function (err, result){
			
			if(err){
				res.locals.error = err;
				res.render('reg', { title: TITLE_REG});
				return;
			}
			
			if(result.insertId > 0){
				res.locals.success = 'Completed! Please click on <a class="btn btn-link" href="/login" role="button"> Login </a>';
			}else{
				res.locals.error = err;
			}
			
			res.render('reg', {title: TITLE_REG});
			});
		
		
	});
});

module.exports = router;