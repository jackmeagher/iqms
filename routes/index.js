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



exports.hw_resource = new Resource('home', '/', {
    get: (req, res) => {
        fun("IqMs", (err, arg) => {
            if (err) {
                console.error("Error occurred!", err);
                res.status(200).json();
                return;
            }
            res.redirect('/www/index.html');
        });
    }
});




exports.question = new Resource('question', '/question', {
        get: (req, res) => { // get all questions
            var query_doc = {};
            if(req.query.difficulty) {
                query_doc.difficulty = req.query.difficulty;
            }
            if(req.query.target_text){
                query_doc.question_text = {like :  "%"  + req.query.target_text + "%"};
                console.log(query_doc.question_text);
            }

            models.question.findAll({where: query_doc}
            ).then(function(questions) {
                res.status(200).json({
                    questions: questions
                });
            })
        },
        post: (req, res) => { // make a new question
            models.question.create({
                question_text: req.body.question_text,
                difficulty: req.body.difficulty
            }).then(function(created) {
                res.status(200).json({
                    question: created.dataValues
                });
            })
        },


    }, [new Resource('get_question_by_id', '/:id', {
        get: (req, res) => { //get question by id
            models.question.findAll({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(question) {
                    res.status(200).json({
                        question: question[0]
                    });
                })
        },
        delete: (req, res) => {
            models.question.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(destroyed) {
                    res.status(200).json({
                        return : 'success'
                    });
                })


        }
    }

    )]

);

exports.interview = new Resource('interview', '/interview', {
        get: (req, res) => {

            models.interview.findAll()
                .then(function(interviews) {
                    res.status(200).json({
                        interviews: interviews
                    });
                })
        },
        post: (req, res) => { // make a new interview
            models.interview.create({}).then(function(created) {
                res.status(200).json({
                    interview: created.dataValues
                });
            })
        },



    }, [new Resource('get_interview_by_id', '/:id', {
        get: (req, res) => { //get interview by id
            models.interview.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(interview) {
                res.status(200).json({
                    interview: interview[0]
                });
            })
        },



        delete: (req, res) => {
            models.interview.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });

        }



    }), new Resource('get_interview_by_id', '/:id/questions', {
        get: (req, res) => { //get interview by id
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    interview.getQuestions()
                        .then(function(questions) {
                            res.status(200).json(questions);
                        })
                })

        }




    }, [new Resource('add_question_to_interview', '/:question_id', {
        post: (req, res) => { // add question to interview
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    models.question.findOne({
                            where: {
                                id: req.params.question_id
                            }
                        })
                        .then(function(question) {
                            interview.addQuestion(question)
                                .then(
                                    function(added) {
                                        res.status(200).json(added);
                                    })
                        })
                });

        },
        delete: (req, res) => { //remove question from interview
            models.interview.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(interview) {
                    models.question.findOne({
                            where: {
                                id: req.params.question_id
                            }
                        })
                        .then(function(question) {
                            interview.removeQuestion(question)
                                .then(
                                    function(removed) {
                                        res.status(200).json(removed);
                                    })
                        })
                });

        }



    })


    ]

    )]

);



exports.answer = new Resource('answer', '/answer', {
        get: (req, res) => {
            models.answer.findAll()
                .then(function(answers) {
                    res.status(200).json({
                        answers: answers
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.answer.create({
                feeedback: req.body.feedback, // SHOCKLEY : <input type="text", name="question_text">
                rating: req.body.rating //            <input type="number" name="difficulty">
            }).then(function(created) {
                res.status(200).json({
                    answer: created.dataValues
                });
            })
        },



    }, [new Resource('get_answer_by_id', '/:id', {
        get: (req, res) => { //get answer by id
            models.answer.findAll({
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(answer) {
                    res.status(200).json({
                        answer: answer
                    });
                })
        },
        delete: (req, res) => {
            models.answer.destroy({
                where: {
                    id: req.params.id
                },
                truncate: true /* this will ignore where and truncate the table instead */
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });


        }


    }

    )]

);

exports.user = new Resource('user', '/user', {
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.user.findAll()
                .then(function(users) {
                    res.status(200).json({
                        users: users
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.user.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(200).json({
                    answer: created.dataValues
                });
            })
        }



    }, [new Resource('get_user_by_id', '/:id', {

        get: (req, res) => { //get answer by id
            console.log("MESSAGE \n\n\n" + req.params.id + "\nMESSAGE \n\n\n");

            models.user.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {
                res.status(200).json({
                    user: user
                });
            })
        },
        delete: (req, res) => {
            models.user.destroy({
                where: {
                    id: req.params.id
                },
                truncate: true /* this will ignore where and truncate the table instead */
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });

        }




    }),
    new Resource('user_interviews', '/:id/interviews/', {

        get: (req, res) => { //get answer by id
            models.interview.findAll({
                where : {
                    userId : req.params.id
                }
            }).then(function(gotten_interviews) {
                    res.status(200).json({
                        interviews: gotten_interviews
                    });
                })
            },
            delete: (req, res) => {
                models.user.destroy({
                    where: {
                        id: req.params.id
                    },
                    truncate: true /* this will ignore where and truncate the table instead */
                }).then(function(destroyed) {
                    res.status(200).json({
                        answer: destroyed.dataValues
                    });
                });

            }




        }

    )]




);



exports.role = new Resource('role', '/role', {
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.role.findAll()
                .then(function(role) {
                    res.status(200).json({
                        role : role
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.role.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(200).json({
                    role: created.dataValues
                });
            })
        }



    }, [new Resource('get_role_by_id', '/:id', {
        get: (req, res) => { //get answer by id
            models.role.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(role) {
                res.status(200).json({
                    role: role
                });
            })
        },
        delete: (req, res) => {
            models.role.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function(destroyed) {
                res.status(200).json({
                    role: destroyed.dataValues
                });
            });

        }




    }

    )]

);
