var mysql = require('mysql');
var DB_NAME = 'voices_node';
var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password:'root'
});

pool.on('connection', function(connection){
	connection.query('SET SESSION auto_increment_increment=1');
});

function User(user){
	this.username = user.username;
	this.userpass = user.userpass;
}

module.exports = User;

pool.getConnection(function(err, connection){
	var useDbSql = "USE " + DB_NAME;
	connection.query(useDbSql, function(err){
		if(err){
			console.log("USE Error: " + err.message);
			return;
		}
		console.log('USE succeed');
	});
	
	//Save data
	User.prototype.save = function save(callback){
		var user = {
			username: this.username,
			userpass: this.userpass
		};
		
		var insertUser_Sql = "INSERT INTO userinfo(id,username,userpass) VALUES(0,?,?)";
		connection.query(insertUser_Sql, [user.username, user.userpass], function(err,result){
			if(err){
				console.log("insertUser_Sql Error: "+ err.message);
				return;
			}
			
			//connection.release();
			
			console.log("invoked[save]");
			callback(err, result);
		});
	};
	
	//Get user count due to username
	User.getUserNumByName = function getUserNumByName(username, callback){
		
		var getUserNumByName_Sql = "SELECT COUNT(1) AS num FROM userinfo WHERE username = ?";
		
		connection.query(getUserNumByName_Sql, [username], function (err, result){
			if(err){
				console.log("getUserNumByName Error: "+err.message);
				return;
			}
			//connection.release();
			
			console.log("invoked[getUserNumByName]");
			callback(err,result);
		});
	};
	
	//Get userinfo due to username
	User.getUserByUserName = function getUserByUserName(username, callback) {

        var getUserByUserName_Sql = "SELECT * FROM userinfo WHERE username = ?";

        connection.query(getUserByUserName_Sql, [username], function (err, result) {
            if (err) {
                console.log("getUserByUserName Error: " + err.message);
                return;
            }

            //connection.release();

            console.log("invoked[getUserByUserName]");
            callback(err,result);                     
        });        
    };
    connection.release();
});
