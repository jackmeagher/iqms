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

var hw_resource = new Resource('hello_world', '/',
    {
        get : (req, res) => {
            fun("Goodbye, world!", (err, arg) => {
                if (err) {
                    console.error("Error occurred!", err);
                    res.json({success: false, error: err});
                    return;
                }
                res.json({success: true, msg: arg});
            });
        }
    });

hw_resource.register(app, '');

module.exports = app;
