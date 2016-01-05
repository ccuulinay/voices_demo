/**
 *This is the recorder for download version.
 *  */


(function(window){
  

  var WORKER_PATH = 'javascripts/def/recorder_download_audiorecorder_worker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if(!this.context.createScriptProcessor){
       this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
       this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
   
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false, 
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    };

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    };

    this.record = function(){
      recording = true;
    };

    this.stop = function(){
      recording = false;
    };

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    };

    this.getBuffers = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffers' })
    };

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    };

    this.exportMonoWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportMonoWAV',
        type: type
      });
    };

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    };

    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
  };

  Recorder.setupPlayback = function(blob){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var player = document.getElementById("audio_pb_player");
    console.log(player);
    //player.autoplay = "autoplay";
    player.controls = "true";
    player.src = url;
  };

  Recorder.setupDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("save");
    link.href = url;
    link.download = filename || 'output.wav';
  };
  
  Recorder.setupUpload = function(blob, props){
	
  	var uploadFile = document.getElementById("upload");
  	uploadFile.setAttribute('uploadToServer','aa');

    var handler = function(e){
      console.log("This is from a click event.");
      console.log(blob);
      setUpload(blob, props);
    };    

  	uploadFile.addEventListener('click', handler, true);  
    
  };

  Recorder.clearUpload = function(){
    var uploadFile = document.getElementById("upload");
    uploadFile.removeAttribute('uploadToServer');
    var clone_uploadFile = uploadFile.cloneNode(true);
    uploadFile.parentNode.replaceChild(clone_uploadFile, uploadFile);
  };

  Recorder.setupUserAudioList = function(){
    setRefreshUserAudioList();
  };

  window.Recorder = Recorder;

})(window);
