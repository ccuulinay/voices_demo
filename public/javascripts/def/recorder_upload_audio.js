var audio = (function (){
	return {
		
		upload : upload
		
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
})();
