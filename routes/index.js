var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



let fun = function(argument, callback) {
    var err = new Error('ERROR!'); // This is how to create an error most of the time
    err = null; // But I don't actually want an error so set it to null, which is the
    // error-free behavior.
    callback(err, argument);
};


//TODO
// PUT edit question















