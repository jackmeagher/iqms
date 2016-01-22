"use strict";
require("use-strict");
var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("Hello world running on port 3000!");
});
