'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(origin);
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get(function(req, res) {
  res.redirect('/api/whoami');
})

app.route('/api/whoami').get(function(req, res) {
// var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // console.log(req.headers);
  // console.log(req.headers.host);
  // console.log(req.headers['accept-language'].split(",")[0]);
  console.log(req.headers['user-agent'].match(/\(([^)]+)\)/));

let ipaddress = req.headers.host,
    language = req.headers['accept-language'].split(",")[0],
    software = req.headers['user-agent'].match(/\(([^)]+)\)/)

  res.send({
    ipaddress: ipaddress,
    language: language,
    software: software[1]
  })

});
// Respond not found to all the wrong routes
app.use(function(req, res, next) {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status || 500).type('txt').send(err.message || 'SERVER ERROR');
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Node.js listening ...');
});
