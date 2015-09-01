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




var setUpload = function(file, props){
    //console.log(hostname);
    console.log("This is from setUpload.");

    
    try{
        client.on('open', handleUpload(file, props));
    }catch(err){
        console.log(err);
    }
	
};

var handleUpload = function(file, props){
    var filename = props.filename;
    console.log(props);
    audio.upload(file, props, function (err, data) {
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
            Recorder.clearUpload();
            setTimeout(function () {
                $(progress).fadeOut(function () {
                    $(progress).text('Can record again now.');
                }).fadeIn();
            }, 5000);
            
        }
    });
};


