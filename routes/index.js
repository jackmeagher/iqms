var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

let fun = function(argument, callback) {
    var err = new Error('ERROR!');  // This is how to create an error most of the time
    err = null;                     // But I don't actually want an error so set it to null, which is the
                                    // error-free behavior.
    callback(err, argument);
};

exports.hw_resource = new Resource('home', '/',
    {
        get : (req, res) => {
            fun("IqMs", (err, arg) => {
                if (err) {
                    console.error("Error occurred!", err);
                    res.json();
                    return;
                }
                res.redirect('/www/index.html');
            })
            ;
        }
    });


// GET all questions
// GET question by id
// GET questions by interview
// GET question by difficulty
// GET question by job type??
// POST new question
// PUT edit question
exports.question = new Resource('question', '/question',
    {
        get : (req, res) => {
            models.sequelize.query('SELECT * FROM "Questions";'
            ).then(function(questions) {
                res.json('index', {
                    title: 'Express',
                    questions: questions
                });})
        },
        post: (req,res) => {
            models.Question.create({
                question_text: req.body.question_text, // SHOCKLEY : <input type="text", name="question_text">
                difficulty: req.body.difficulty        //            <input type="number" name="difficulty">
            });
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

    },[new Resource('get_question_by_id','/:id',
        {
            get: (req,res) =>
                {
                models.sequelize.query('SELECT * FROM "Questions" WHERE id = ' + req.params.id + ';')
                    .then(function(question) {
                        res.status(200).json(
                        {
                        question: question[0]
                        }
                        );
                    }
    )}})]);

// GET all interviews
// GET interview by id
// GET interview by user
// POST add question to interview
exports.interview = new Resource('interview', '/interview',
    {
        get : (req, res) => {

            models.sequelize.query('SELECT * FROM "Interviews"'
            ).then(function(interviews) {
                res.json('index', {
                    title: 'Express',
                    interviews: interviews
                });})
        },
        post: (req,res) => {
            models.Interview.create({
                // TODO : add fields
            }).then(function(created) {
                res.status(200).json({
                    Interview: created.dataValues
                }
                );
                //find(page.id)
                //    .success(function(result){
                //        console.log(result)
                //    })

            });

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.interview_id // TODO : where do we pull this from?
            });
            //    .then(function() {
            //    res.redirect('/'); //TODO :  this should probably redirect to the same page...
            //});

        }


    },[new Resource('get_interview_questions','/:id',
        {




        })
    ]);



// GET IQR by interview id, question id
// POST make new IQR
// put edit IQR
// delete REMOVE IQR
exports.answer = new Resource('', '/answer',
    {
        get : (req, res) => {
            res.json('answer', {
                title: 'Express',
                interviews : "answers go here"
            });
        },
        post: (req,res) => {
            models.Interview.create({
                interviewee: req.body.interviewee, // SHOCKLEY : <input type="text", name="question_text">

            });

        },
        delete: (req,res) => {
            models.Question.destroy({
                id: req.params.answer_id// TODO : where do we pull this from?
            });
            //    .then(function() {
            //    res.redirect('/'); //TODO :  this should probably redirect to the same page...
            //});


        }


    });


// FOR CONDUCTING INTERVIEW :
//TODO: POST Answer ( record feedback)
//TODO: GET NextQuestion ( the next question in interview where that question doesnt have an IQR for that interview
//TODO: GET SkipQuestion ( can we fold this into NextQuestion? )
// GET ALL QUESTIONS

exports.conductInterview = new Resource('nextQuestion','/Interview/:id/NextQuestion',
    {
        // SELECT Question
        // FROM Interview
        // WHERE question_id NOT IN Answer
        // AND interview_id NOT IN Answer
        get: (req,res) => {
            get : (req, res) => {
            }
                models.Interview.findAll(
                ).then(function(questions) {
                    res.json('index', {
                        title: 'Express',
                        questions: questions
                    });})
            }





    });