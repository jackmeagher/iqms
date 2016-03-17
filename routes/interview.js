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
            models.interview.create({}).then
            (
                function(created)
            {
                res.status(200).json
                ({
                    interview: created.dataValues
                });
            }
            )
        },


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
            models.sequelize.query('SELECT * FROM questions WHERE id in ( SELECT question_id FROM "interviewQuestions"' +
                    'WHERE interview_id =' + req.params.id + ')',{ type: models.sequelize.QueryTypes.SELECT} )
                .then(function (questions) {
                    res.status(200).json(questions);
                })

        },
        /// delete all questions from interview
        delete: (req, res) => { //get interview by id
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

                            models.interviewQuestion.create(
                                {
                                    interview_id : req.params.id,
                                    question_id : req.params.question_id
                                }
                            )
                                .then(
                                    function(iq) {
                                        res.status(200).json(iq);
                                    })

        },

        /// remove question from interview
        delete: (req, res) => {
            models.interviewQuestion.destroy({
                where: {
                    interview_id: req.params.id,
                    question_id : req.params.question_id
                }
            }).then(function(destroyed) {
                res.status(200).json({
                    success : destroyed
                });
            });

        }

    })

    ]


);