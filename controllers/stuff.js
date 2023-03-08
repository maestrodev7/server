exports.streaming= (req, res) => {
    const fs = require('fs');

var path = 'assets/jfk.mp4';

     // res.sendFile(path, { root: __dirname });
        // On récupère les informations du fichier viddéo
      var stat    = fs.statSync(path);
        // On récupère la taille de la vidéo
      var total   = stat.size;
   
      console.log(total);
      if (req.headers['range']) {
              // On récupère les indications sur la partie du fichier à envoyer
          var range         = req.headers.range;
              // On met les informations dans un tabeau
          var parts         = range.replace(/bytes=/, "").split("-");
            // On prend la valeur indiquant le début dans le fichier
          var partialstart  = parts[0];
          // On prend la valeur indiquant la fin dans le fichier
          var partialend    = parts[1];
              // On met ça au format integer
          var start         = parseInt(partialstart, 10);
          var end           = partialend ? parseInt(partialend, 10) : total-1;
  
      // On mesure la taille du fichier
      var chunksize     = (end-start)+1;
    // On l'affiche
    console.log('Partial file - range: ' + start + ' to ' + end + ' = ' + chunksize);
      
      // On crée le stream du morceau de fichier
      var file          = fs.createReadStream(path, {start: start, end: end});
         // On crée l'entête (le code HTTP 206 indique que l'on ne fournit qu'une partie du fichier)
      res.writeHead(206, {
        'Content-Range' :   'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges' :   'bytes',
        'Content-Length':   chunksize,
        'Content-Type'  :   'video/mp4' }); 
      // On envoie le fichier au client
      file.pipe(res);
  
      } else {
        console.log('Whole file: ' + total);
        // On crée l'entête
        res.writeHead(200, { 
          'Content-Length':     total,
          'Content-Type'  :     'video/mp4'
        }); 
    
        // On crée le stream au client
        fs.createReadStream(path).pipe(res);
      }
  }

  exports.image= (req, res) => {
    const net = require('node:net')
    const child = require('node:child_process')
    
  function onSpawnError(data) {
      console.log(data.toString());
  }
  
  function onSpawnExit(code) {
      if (code != null) {
          console.log('GStreamer error, exit code ' + code);
      }
  }
    var date = new Date();
    res.writeHead(200, {
      'Date': date.toUTCString(),
      'Connection': 'close',
      'Cache-Control': 'private',
      'Content-Type': 'video/webm'
  });
  var tcpServer = net.createServer(function (socket) {
    socket.on('data', function (data) {
        res.write(data);
    });
    socket.on('close', function (had_error) {
        res.end();
    });
});

tcpServer.maxConnections = 1;
tcpServer.listen(function () {
  console.log("Connection started.");
  if (gstMuxer == undefined) {
    console.log("inside gstMuxer == undefined");
    var cmd = 'gst-launch-1.0';
    var args =
        ['autovideosrc',
            '!', 'video/x-raw,framerate=30/1',
            '!', 'videoconvert',
            '!', 'queue', 'leaky=1',
            '!', 'vp8enc',
            '!', 'queue', 'leaky=1',
            '!', 'm.', 'autoaudiosrc',
            '!', 'queue', 'leaky=1',
            '!', 'audioconvert',
            '!', 'vorbisenc',
            '!', 'queue', 'leaky=1',  
            '!', 'm.', 'webmmux', 'name=m', 'streamable=true',
            '!', 'queue', 'leaky=1',
            '!', 'tcpclientsink', 'host=localhost',
            'port=' + tcpServer.address().port];
  console.log(tcpServer.address().port);
    var gstMuxer = child.spawn(cmd, args);
  
    gstMuxer.stderr.on('data', onSpawnError);
    gstMuxer.on('exit', onSpawnExit);
  
}
else {
    console.log("New GST pipeline rejected because gstMuxer != undefined.");
}
 
  res.connection.on('close', function () {
      gstMuxer.kill();
  });
});

  }