var audio = (function (){
	return {
		list   : list,
		request : request,
		upload : upload,
		download : download		
	};

	function upload(file, props, cb){
		
		var stream = emit('upload', {
			author : props.username,
	        name  : props.filename,
	        size  : file.size,
	        type  : file.type
	    }, file);

		stream.on('data', function(data){
			cb(null, data);
		});

		stream.on('err',cb);
	}

	function list(props, cb) {
		console.log(props);
		var stream = emit('list',{
			author : props.username
		});

		stream.on('data' , function(data){
			cb(null, data.files);
		});

		stream.on('error', cb);
	}

	function request(props, name){
		console.log("I'm here for request.");
		emit('request',{
			name : name,
			author : props.username
		});
	}

	function download(stream ,cb){
		var parts = [];

		stream.on('data', function(data){
			parts.push(data);
		});

		stream.on('error', function(err){
			cb(err);
		});

		stream.on('end',function(){
			console.log(parts);
			var src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
			cb(null, src);
		});
	}	
})();
