/**
 * Created by nick on 2/5/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser'); // for req attrs
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());


router.get('/', function(req, res) {
    models.Question.findAll(
    ).then(function(questions) {
        res.render('index', {
            title: 'Express',
            questions: questions
        });
    });
});


router.post('/create', function(req, res) {
    models.Question.create({
        question_text: req.body.question_text,
        difficulty: req.body.difficulty
    }).then(function() {
        res.redirect('/');
    });
});


router.get('/questions/:question_id/delete', function(req, res) {
    models.Question.destroy({
        where: {
            id: req.params.question_id
        }
    }).then(function() {
        res.redirect('/');
    });
});









module.exports = router;
