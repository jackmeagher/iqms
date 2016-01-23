"use strict";
require("use-strict");
var express = require('express');
var app = express();

let fun = function(argument, callback) {
    var err = new Error('ERROR!');  // This is how to create an error most of the time
    err = null;                     // But I don't actually want an error so set it to null, which is the
                                    // error-free behavior.
    callback(err, argument);
}

app.get('/', (req, res) => {
    fun("Hello, world!", (err, arg) => {
        if (err) {
            console.error("Error occurred!", err);
            res.json({success: false, error: err});
            return;
        }
        res.json({success: true, msg: "Hello, world!"});
    });
});

module.exports = app;