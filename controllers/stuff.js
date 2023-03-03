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
    Stream = require("node-rtsp-stream");
    stream = new Stream({
      name: "Bunny",
      // streamUrl: "rtsp://YOUR_IP:PORT",
      streamUrl: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",
      wsPort: 9999,
      ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
      }
    });
    
    
res.send(stream)
  }