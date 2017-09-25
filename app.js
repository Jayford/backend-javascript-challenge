var express = require('express');
var app = express();

/****Service routing****/

const flickrApi = require('./flickrApi.js');
 
app.use('/images',flickrApi);

module.exports = app;