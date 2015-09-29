function drawBuffer( width, height, context, data ) {
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j]; 
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
};



$(audio_player).ready(function(){
    try{
        client.on('stream', function(stream){
            console.log("This is from stream_handler.");
            audio.download(stream, function (err, src){
                console.log(src);
                var audio_player = document.getElementById("audio_player");
                audio_player.autoplay = "autoplay";
                audio_player.controls = "true";
                audio_player.src = src;
                //$(audio_player).attr('src', src);
            });
        });
    }catch(err){
        console.log(err);
    };

});
