/**
 * Created by nick on 3/15/16.
 */
var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('interview', '/interview',
    {
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
        post: (req, res) =>
        { // make a new interview
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


        // interview/id
    },
    [
        new Resource('get_interview_by_id', '/:id',
            {
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



    }),

        new Resource('get_questions_from_interview', '/:id/questions', {
        get: (req, res) => { //get interview by id
            models.sequelize.query('SELECT * FROM questions WHERE id in ( SELECT question_id FROM "interviewQuestions"' +
                    'WHERE interview_id =' + req.params.id + ')',{ type: models.sequelize.QueryTypes.SELECT} )
                .then(function (questions) {
                    res.status(200).json(questions);
                })

        }}),

        //    models.interview.findOne({
        //            where: {
        //                id: req.params.id
        //            }
        //        })
        //        .then(function(interview) {
        //            models.interviewQuestion.findAll({
        //                where :
        //                {
        //                    //interview_id : interview.id
        //                }
        //            })
        //                .then(function(iqs) {
        //                    res.status(200).json(iqs);
        //                })
        //        })
        //
        //}





        new Resource('add_question_to_interview', '/:id/questions/:question_id', {
        post: (req, res) => { // add question to interview

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
            //models.interview.findOne({
            //        where: {
            //            id: req.params.id
            //        }
            //    })
            //    .then(function(interview) {
            //        models.question.findOne({
            //                where: {
            //                    id: req.params.question_id
            //                }
            //            })
            //            .then(function(question) {
            //                console.log(interview);
            //
            //                models.interviewQuestion.create(
            //                    {
            //                        interview_id : interview.id,
            //                        question_id : question.id
            //                    }
            //                )
            //                    .then(
            //                        function(iq) {
            //                            res.status(200).json(iq);
            //                        })
            //            })



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