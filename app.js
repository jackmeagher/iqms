"use strict";
require("use-strict");
var express = require('express');
var app = express();

var fun = function(argument, callback) {
    var err = new Error('ERROR!');
    err = null;
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

app.listen(3000, () => {
    console.log("Hello world running on port 3000!");
});
