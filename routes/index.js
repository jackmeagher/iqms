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
                res.status(200).json({
                    success: true,
                    questions: questions
                });
            })
        },
        post: (req,res) => {
            models.Question.create({
                question_text: req.body.question_text, // SHOCKLEY : <input type="text", name="question_text">
                difficulty: req.body.difficulty        //            <input type="number" name="difficulty">
            })
                //.then(function() {
                //res.redirect('/'); // TODO :  this should probably redirect to the same page...
            //});

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.question_id  // TODO : where do we pull this from?
            })
            //    .then(function() {
            //    res.redirect('/'); // TODO :  this should probably redirect to the same page...
            //});


        }


    });


exports.interview = new Resource('interview', '/interview',
    {
        get : (req, res) => {
                res.json('interviews', {
                    title: 'Express',
                    interviews : "interviews go here"
                });
        },
        post: (req,res) => {
            res.json('interviews', {
                title: 'Express',
                interviews : "you created an interview"
            });

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.interview_id // TODO : where do we pull this from?
            })
            //    .then(function() {
            //    res.redirect('/'); //TODO :  this should probably redirect to the same page...
            //});


        }


    });



exports.interviewQuestionReceipts = new Resource('interviewQuestionReceipt', '/InterviewQuestionReceipt',
    {
        get : (req, res) => {
            res.json('interviewQuestionReceipts', {
                title: 'Express',
                interviews : "interviewQuestionReceipts go here"
            });
        },
        post: (req,res) => {
            res.json('interviews', {
                title: 'Express',
                interviews : "you created an interviewQuestionReceipt"
            });

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.interviewQuestionReceipt// TODO : where do we pull this from?
            })
            //    .then(function() {
            //    res.redirect('/'); //TODO :  this should probably redirect to the same page...
            //});


        }


    });

