/**
 * Created by malcolm on 2/11/16.
 *
 * This is messy but will insert our questions into the DB
 */

var models  = require('../models');

models.question.create({
    question_text : 'Have you worked with javascript libraries?',
    difficulty : 1
});

models.question.create({
    question_text : 'Explain the difference between the JavaScript call and apply functions.',
    difficulty : 1
});

models.question.create({
    question_text : 'Define the term closure and give an example of it in JavaScript.',
    difficulty : 2
});

models.question.create({
    question_text : 'Identify two ways in which you can clear a floated element with HTML/CSS.',
    difficulty : 2
});

models.question.create({
    question_text : 'What is the difference between event bubbling and event capture?',
    difficulty : 2
});