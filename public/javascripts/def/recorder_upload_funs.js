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
    //console.log(props);
    audio.upload(file, props, function (err, data) {
        var msg;
        if (data.end) {
            msg = "Upload complete.";
                
        } else if (data.rx) {
             //msg = Math.round(tx += data.rx * 100) + '% complete';
    
        } else {
             // assume error
             console.log(data.err);
             msg = "Upload failed."
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

var setRefreshUserAudioList = function(){
    console.log("This is from setRefreshUserAudioList.");
    var username = document.getElementById("header_username").getAttribute("value");
    console.log(username);
    var props = [];
    props.username = username;

    var handleRefreshUserAudioList = function (err, user_audios){
        console.log("This is from handleRefreshUserAudioList.");
        var $ul,$li;
        $(user_audio_list).empty();
        $ul = $('<ul class="list-group">').appendTo($(user_audio_list));

        user_audios.forEach(function(user_audio){
            $li = $('<li class="list-group-item">').appendTo($ul);
            $a = $('<a>').appendTo($li);

            $a.attr('href','#').text(user_audio).click(function(e){
                fizzle(e);
                var name = $(this).text();
                audio.request(props, name);
            });
        });
    };

    var open_handler = function(props){        
        audio.list(props, handleRefreshUserAudioList );
    };

    
    var client_connected = false;

    if(!client_connected){
        try{
            //console.log(Object.getOwnPropertyNames(client));
            client.on('open', open_handler(props));
        }catch(err){
            console.log(err);
            console.log(err.message);
            console.log(Object.getOwnPropertyNames(err));
            if(err.message.toString().includes("addListener only takes instances")){
                client_connected = true;
            }else if(err.message.toString().includes("Client is not yet connected or has closed")){
                client_connected = false;
                clinet = new BinaryClient('ws://' + hostname + ':9001');
                //setTimeout(1000);
            };

            
        };

        console.log(client_connected);
    };

    
};






