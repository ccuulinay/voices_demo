var hostname = window.location.hostname;
var client = new BinaryClient('ws://' + hostname + ':9001');

function fizzle(e){
	e.preventDefault();
	e.stopPropagation();
}

function emit(event, data, file){
	file = file || {};
	data = data || {};
	data.event = event;

	return client.send(file, data);
}




var setUpload = function(file, filename){
    //console.log(hostname);
    console.log("This is from setUpload.");

    //console.log(file);
    try{
        client.on('open', handleUpload(file, filename));
    }catch(err){
        console.log(err);
    }
	
};

var handleUpload = function(file, filename){
    
    audio.upload(file,filename, function (err, data) {
        var msg;
        if (data.end) {
            msg = "Upload complete: " + filename;
            enable_upload = false;
                
        } else if (data.rx) {
             msg = Math.round(tx += data.rx * 100) + '% complete';
    
        } else {
             // assume error
             msg = data.err;
         }

        console.log(msg);
     
        $(progress).text(msg);
     
        if (data.end) {
            setTimeout(function () {
                $(progress).fadeOut(function () {
                    $(progress).text('Can record again now.');
                }).fadeIn();
            }, 5000);
        }
    });
};


