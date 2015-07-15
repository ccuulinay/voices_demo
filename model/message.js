var mysql = require('mysql');
var DB_NAME = 'voices_node';
var pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password:''
});

pool.on('connection', function(connection){
	connection.query('SET SESSION auto_increment_increment=1');
});

//Find a method to handle the disconnect. Using err code: PROTOCOL_CONNECTION_LOST

function Message(message){
	this.username = message.username;
	this.details = message.details;
}

module.exports = Message;

//Find a method to avoid SQL injection. Using connection.escape('_edit_lock') meta_key='_edit_lock'.

pool.getConnection(function(err,connection){
	var useDbSql = "USE " + DB_NAME;
	connection.query(useDbSql, function(err){
		if(err){
			console.log("USE Error: " + err.message);
			return;
		}
		console.log('USE succeed');
	});
	
	//Save data
	Message.prototype.save = function save(callback){
		var message = {
			username : this.username,
			details : this.details
			
		};
		
		var insertMessage_Sql = "INSERT INTO message_info(id,username,details) VALUES(0,?,?)";
		connection.query(insertMessage_Sql, [message.username, message.details], function(err, result){
			if(err){
				console.log("insertUser_Sql Error: "+ err.message);
				return;
			}
			
			//connection.release();
			
			console.log("invoked[save]");
			callback(err, result);
		});
	};
	
	//Delete one message due to Id
	Message.deleteMessageById = function deleteMessageById(id, callback){
		
		var deleteMessageById_Sql = "DELETE FROM message_info WHERE id = ?";
		
		connection.query(deleteMessageById_Sql, [id], function (err,result){
			if(err){
				console.log("deleteMessageById Error: "+err.message);
				return;
			}
			
			console.log("invoked[deleteMessageById]");
			callback(err,result);
		});
	};
	
	//Get message count due to username
	Message.getMessageNumByName = function getMessageNumByName(username, callback){
		
		var getMessageNumByName_Sql = "SELECT COUNT(1) AS num FROM message_info WHERE username = ?";
		
		connection.query(getMessageNumByName_Sql, [username], function (err, result){
			if(err){
				console.log("getMessageNumByName Error: "+err.message);
				return;
			}
			//connection.release();
			
			console.log("invoked[getMessageNumByName]");
			callback(err,result);
		});
	};
	
	//Get all messages due to username
	Message.getMessagesByName = function getMessagesByName(username, callback){
		
		var getMessagesByName_Sql = "SELECT * FROM message_info WHERE username = ?";
		connection.query(getMessagesByName_Sql, [username], function (err, result){
			if(err){
				console.log("getMessagesByName Error: "+err.message);
				return;
			}
			
			console.log("invoked[getMessagesByName]");
			callback(err,result);
		});
	};
	
	//Get all messages
	Message.getAllMessages = function getAllMessages(callback){
		
		var getAllMessages_Sql = "SELECT * FROM message_info";
		connection.query(getAllMessages_Sql, function (err, result){
			if(err){
				console.log("getAllMessages Error: " + err.message);
				return;
			}
			console.log("invoked[getAllMessage]");
			callback(err,result);
		});
	};
	
	//Get a message due to id
	Message.getMessageById = function getMessageById(Id, callback){
		
	};
});
