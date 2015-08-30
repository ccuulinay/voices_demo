/*
This is the model of the audio
*/
var fs = require('fs');
var uploadPath = __dirname + '/../audios';
var supportedTypes = [
	'audio/wav',
	'audio/mp3'
];

module.exports = {
	list : list,
	select : select,
	upload : upload
};

function list(stream, meta){
	fs.readdir(uploadPath, function (err, files){
		stream.write({ files : files});
	});
}

function select(client, meta){
	var file = fs.createReadStream(uploadPath + '/' + meta.name);
	client.send(file);
}

function upload(stream, meta){
	console.log("This is from upload.");
	var file = fs.createWriteStream(uploadPath + "/" + meta.name);
	stream.pipe(file);


	stream.on('end', function(){
		stream.write({end: true});
	});
}
