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
                    res.status(200).json();
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
        get : (req, res) => { // get all questions
            models.question.findAll({
                where:{
                    id : req.params.id
                }
            }).then(function(questions) {
                res.status(200).json({
                    questions: questions
                })

                ;})
        },
        post: (req,res) => { // make a new question
            console.log(req);
            models.question.create({
                question_text: req.body.question_text, // SHOCKLEY : <input type="text", name="question_text">
                difficulty: req.body.difficulty        //            <input type="number" name="difficulty">
            }).then(function(created) {
                        res.status(200).json({
                                question: created.dataValues
                            }
                        );
            })
        },


    },[new Resource('get_question_by_id','/:id',
        {
            get: (req,res) => { //get question by id
                models.question.findAll({
                        where:{
                            id : req.params.id
                        }
                    })
                    .then(function(question) {
                        res.status(200).json(
                        {
                        question: question[0]
                        }
                        );
                    }
    )},
            delete: (req,res) => {
                models.question.destroy({
                    where: {
                        id : req.params.id
                    },
                    truncate: true /* this will ignore where and truncate the table instead */
                })
                .then(function(destroyed) {
                    res.status(200).json({
                            answer: destroyed.dataValues
                        }
                    );
                })


            }
        }

    )]

);

exports.interview = new Resource('interview', '/interview',
    {
        get : (req, res) => {

            models.interview.findAll()
                .then(function(interviews) {
                res.status(200).json({
                    interviews: interviews
                });})
        },
        post: (req,res) => { // make a new interview
            console.log(req);
            models.interview.create({
            }).then(function(created) {
                res.status(200).json({
                        interview: created.dataValues
                    }
                );
            })
        },



    },[new Resource('get_interview_by_id','/:id',
        {
            get: (req,res) => { //get interview by id
                models.interview.findAll({
                    where:{
                        id : req.params.id
                    }
                })                    .then(function(interview) {
                            res.status(200).json(
                                {
                                    interview: interview[0]
                                }
                            );
                        }
                    )},



            delete: (req,res) => {
                models.interview.destroy({
                    where: {
                        id : req.params.id
                    },
                    truncate: true /* this will ignore where and truncate the table instead */
                }).then(function(destroyed) {
                    res.status(200).json({
                            answer: destroyed.dataValues
                        }
                    );
                });

            }



        }),new Resource('get_interview_by_id','/:id/questions',
            {
                get: (req,res) => { //get interview by id
                    models.interview.findOne({
                        where: {
                                id : req.params.id
                                }
                    }).then(function(interview) {
                        interview.getQuestions()
                    .then(function(questions) {
                            res.status(200).json(questions);
                    })})

                }












            },
        [new Resource('add_question_to_interview','/:question_id',
                {
                    post: (req,res) => { //get interview by id
                        models.interview.findOne({
                            where: {
                                id : req.params.id
                            }
                        }).then(function(interview)
                        {
                            models.question.findOne({
                                where: {
                                    id : req.params.question_id
                                        }
                            }).then(function(question)
                            {
                                interview.addQuestion(question).then(
                                    function(added){
                                        res.status(200).json(added);
                                    }
                                )


                            })
                        });

                    }




                })


        ]

    )]

);



// GET IQR by interview id, question id
// POST make new IQR
// put edit IQR
// delete REMOVE IQR
exports.answer = new Resource('answer', '/answer',
    {
        get : (req, res) => {
            models.answer.findAll()
                .then(function(answers) {
                res.status(200).json({
                    answers: answers
                });})
        },
        post: (req,res) => { // make a new question
            console.log(req);
            models.answer.create({
                feeedback: req.body.feedback, // SHOCKLEY : <input type="text", name="question_text">
                rating: req.body.rating        //            <input type="number" name="difficulty">
            }).then(function(created) {
                res.status(200).json({
                        answer: created.dataValues
                    }
                );
            })
        },



    },[new Resource('get_answer_by_id','/:id',
        {
            get: (req,res) => { //get answer by id
                models.answer.findAll({
                    where:{
                        id : req.params.id
                    }
                })
                    .then(function(answer) {
                            res.status(200).json(
                                {
                                    answer: answer
                                }
                            );
                        }
                    )},
            delete: (req,res) => {
                models.answer.destroy({
                    where: {
                        id : req.params.id
                    },
                    truncate: true /* this will ignore where and truncate the table instead */
                }).then(function(destroyed) {
                    res.status(200).json({
                            answer: destroyed.dataValues
                        }
                    );
                });


            }


        }

    )]

);

exports.user = new Resource('user', '/user',
    {
        get : (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.user.findAll()
                .then(function(users) {
                res.status(200).json({
                    users: users[0]
                });})
        },
        post: (req,res) => { // make a new question
            console.log(req);
            models.user.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(200).json({
                        answer: created.dataValues
                    }
                );
            })
        },



    },[new Resource('get_user_by_id','/:id',
        {
            get: (req,res) => { //get answer by id
                models.user.findAll({
                    where:{
                        id : req.params.id
                    }
                })                    .then(function(user) {
                            res.status(200).json(
                                {
                                    answer: user[0]
                                }
                            );
                        }
                    )},
            delete: (req,res) => {
                models.user.destroy({
                    where: {
                        id : req.params.id
                    },
                    truncate: true /* this will ignore where and truncate the table instead */
                }).then(function(destroyed) {
                    res.status(200).json({
                            answer: destroyed.dataValues
                        }
                    );
                });

            }




        }

    )]

);

