/*
This is the model of the audio
*/
var fs = require('fs');
var uploadPath_root = __dirname + '/../audios';
var supportedTypes = [
	'audio/wav',
	'audio/mp3'
];

function path_exsit(path){
	var flag = 0 ;
	fs.stat(path, function(err, stat){
		if(err == null){
			if(stat.isDirectory()){
				console.log('Directory exists.');
				flag = 1;
			} else if(stat.isFile()){
				console.log('Path is a file but not a directory.');
				flag = 0;
			} else {
				console.log('Path is not a file or a directory.');
				console.log(stat);
				flag = 0;
			}
		} else if(err.code == 'ENOENT'){
			console.log(err.name);
			console.log('Path is not existed.');
			flag = 0;
		} else {
			console.log ('error: ' + err);
			flag = 0;
		}
	});
	console.log(flag);
}

module.exports = {
	list : list,
	select : select,
	upload : upload
};

function list(stream, meta){
	fs.readdir(uploadPath_root, function (err, files){
		stream.write({ files : files});
	});
}

function select(client, meta){
	var file = fs.createReadStream(uploadPath_root + '/' + meta.name);
	client.send(file);
}

function upload(stream, meta){
	console.log("This is from upload.");
	console.log(meta.author);

	var uploadPath = uploadPath_root + "/" + meta.author;

	fs.stat(uploadPath, function(err, stat){
		if(err == null){
			if(stat.isDirectory()){
				console.log('Directory exists.');
				var file = fs.createWriteStream( uploadPath + "/"  + meta.name);
				stream.pipe(file);

				stream.on('end', function(){
					stream.write({end: true});
				});
			} else if(stat.isFile()){
				console.log('Path is a file but not a directory.');
				
			} else {
				console.log('Path is not a file or a directory.');
				console.log(stat);
				
			}
		} else if(err.code == 'ENOENT'){
			console.log(err.name);
			console.log('Path is not existed, will create now.');
			fs.mkdir(uploadPath, function(err){
				if(err) console.log(err);
			});
			console.log('Path is created. Begin to upload the audio.');
			var file = fs.createWriteStream( uploadPath + "/"  + meta.name);
			stream.pipe(file);

			stream.on('end', function(){
				stream.write({end: true});
			});
		} else {
			console.log ('error: ' + err);
			
		}
	});

	// var file = fs.createWriteStream(uploadPath_root + "/"  + meta.name);
	// stream.pipe(file);


	// stream.on('end', function(){
	// 	stream.write({end: true});
	// });
}


