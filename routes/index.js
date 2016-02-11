var models = require('../models');
var Resource = require('../lib/Resource');

var exports = module.exports = {};


let fun = function(argument, callback) {
    var err = new Error('ERROR!');  // This is how to create an error most of the time
    err = null;                     // But I don't actually want an error so set it to null, which is the
                                    // error-free behavior.
    callback(err, argument);
};


exports.hw_resource = new Resource('hello_world', '/',
    {
        get : (req, res) => {
            fun("IqMs", (err, arg) => {
                if (err) {
                    console.error("Error occurred!", err);
                    res.json({success: false, error: err});
                    return;
                }
                res.json({success: true, msg: arg});
            });
        }
    });

exports.question = new Resource('question', '/question',
    {
        get : (req, res) => {
            models.Question.findAll(
            ).then(function(questions) {
                res.json('index', {
                    title: 'Express',
                    questions: questions
                });})},
        post: (req,res) => {
            models.Question.create({
                question_text: req.body.question_text, // SHOCKLEY : <input type="text", name="question_text">
                difficulty: req.body.difficulty        //            <input type="number" name="difficulty">
            }).then(function() {
                res.redirect('/'); //TODO :  this should probably redirect to the same page...
            });

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.question_id //
            }).then(function() {
                res.redirect('/'); //TODO :  this should probably redirect to the same page...
            });


        }


    });