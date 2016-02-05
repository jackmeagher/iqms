"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');

var routes = require('./routes/index');

app.use('/', routes);


let fun = function(argument, callback) {
    var err = new Error('ERROR!');  // This is how to create an error most of the time
    err = null;                     // But I don't actually want an error so set it to null, which is the
                                    // error-free behavior.
    callback(err, argument);
};

//var u = models.User.Build({
//    username : "milkman55",
//    first_name : "jesus",
//    last_name : "jesus",
//    pw_hash : "1293i1ediojwj"
//});
//
//
//
//u.save().catch(function(error) {
//    // mhhh, wth!
//});
//
//x = models.User.findAll();

// GET method route






//hw_resource.register(app, '');

module.exports = app;