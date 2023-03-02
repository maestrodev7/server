const express = require('express');
const stuffRoutes = require('./routes/stuff');
//const streamRoutes = require('./routes/stream');
const app = express();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
  });

app.use('/video', stuffRoutes);
//app.use('/rtsp', streamRoutes);
module.exports = app;