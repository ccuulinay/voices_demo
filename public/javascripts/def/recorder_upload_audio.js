var audio = (function (){
	return {
		
		upload : upload
		
	};

	function upload(file, filename, cb){
		var stream = emit('upload', {
	        name  : filename,
	        size  : file.size,
	        type  : file.type
	    }, file);

		stream.on('data', function(data){
			cb(null, data);
		});

		stream.on('err',cb);
	}	
})();
