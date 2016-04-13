/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('get_all_interviews', '/interview',
    {
        // get all interviews
        get: (req, res) =>
        {

            models.interview.findAll()
                .then(function(interviews)
                {
                    res.status(200).json
                    ({
                        interviews: interviews
                    });
                })
        },
        // make a new interview
        post: (req, res) =>
        {
            console.log(req.body);
            models.interview.create({
                label : req.body.label,
                interviewee : req.body.interviewee

            }).then
            (
                function(created)
            {
                res.status(201).json
                ({
                    interview: created.dataValues
                });
            }
            )
        }


    },
    [
        new Resource('get_interview_by_id', '/:id',
            {
        // get interview
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


        // delete interview
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



    }),

        new Resource('get_questions_from_interview', '/:id/questions', {
        /// get all questions from interview
        get: (req, res) => {
            models.interview.findOne({where:{
                id:req.params.id
            }}).then(function(interview){

                    questions :  interview.getQuestions().then(function(questions){
                        res.status(200).json(
                            {
                            questions : questions
                            }
                        )}
                        )
                    }
                )

            }

        ,
        /// delete all questions from interview
        delete: (req, res) => {
            models.interviewQuestion.destroy({
                where: {
                interview_id : req.params.id
            }}
            )
                .then(function (destroyed) {
                    res.status(200).json(destroyed);
                })

        }








        }),






        new Resource('add_remove_question_to_interview', '/:id/questions/:question_id', {
        /// add question to interview
        post: (req, res) => {

                            models.interview.findOne({where:
                            {
                                id : req.params.id
                            }}).then(function(interview){
                                    models.question.findOne(
                                        {
                                            where: {
                                                id: req.params.question_id
                                            }
                                        }).then(function(question){
                                    interview.addQuestion(question).then(
                                        function(added){
                                            res.status(200).json({
                                                added : added
                                            });
                                        }
                                    )

                                })})
        },

        /// remove question from interview
        delete: (req, res) => {
            models.interviewQuestion.destroy({
                where: {
                    interview_id: req.params.id,
                    question_id : req.params.question_id
                }
            }).then(function(destroyed) {
                res.status(203).json({
                });
            });

        }

    }),

        new Resource('get_answers_from_interview', '/:id/answers', {
            /// get all answers from interview
            get: (req, res) => {
                models.sequelize.query('SELECT * FROM answers WHERE interview_id =' + req.params.id
                      ,{ type: models.sequelize.QueryTypes.SELECT}
                )
                    .then(function (answers) {
                        res.status(200).json(answers);
                    })

            },
            /// delete all answers from interview
            delete: (req, res) => {
                models.answer.destroy({
                        where: {
                            interview_id : req.params.id
                        }}
                    )
                    .then(function (destroyed) {
                        res.status(204).json({});
                    })

            }



        }),

        new Resource('get_answers_from_interview', '/:id/next', {
            /// get questions that haven't been answered
            get: (req, res) => {
                models.sequelize.query(
                    'SELECT * FROM questions ' +
                    'WHERE id IN (' +
                        'SELECT question_id ' +
                        'FROM "interviewQuestions" ' +
                        'WHERE interview_id =' + req.params.id + ') ' +
                        'AND id NOT IN(' +
                            'SELECT question_id ' +
                            'FROM answers ' +
                            'WHERE interview_id =' + req.params.id + ')'
                    , { type: models.sequelize.QueryTypes.SELECT}
                )
                    .then(function (answers) {
                        res.status(200).json(answers);
                    })

            }


        })

    ]


);
