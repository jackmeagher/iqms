/**
 * Created by malcolm on 2/11/16.
 *
 * This is messy but will insert our questions into the DB
 */

var models  = require('./models');

models.sequelize.query('TRUNCATE answers, interviews, questions, roles, users,"interviewQuestions" CASCADE;')

//FRONT END DEVELOPER SAMPLE QUESTIONS

models.interview.create({
    label : 'Front-End Developer',
    interviewee : 'Ben Byrd'
});




models.interview.create({
    label : 'Back-end Developer',
    interviewee : 'Jack Meagher'
});

models.interview.create({
    label : 'Data Scientist',
    interviewee : 'Nick DeSisto'

});


models.interview.create({
    label : 'Janitorial Technician',
    interviewee : 'James Shockley'

});


models.interview.create({
    label : 'Sith Lord',
    interviewee : 'Sebastian van Delden'

});

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

//BACK END DEVELOPER SAMPLE QUESTIONS
models.question.create({
    question_text : 'Talk about the 3 worst defects of your preferred language.',
    difficulty : 1
});

models.question.create({
    question_text : 'Why are first-party cookies and third-party cookies treated so differently?',
    difficulty : 1
});

models.question.create({
    question_text : 'How would you manage the migration of a project from MySQL to PostgreSQL?',
    difficulty : 2
});

models.question.create({
    question_text : 'How would you backup and restore data using mysqldump from the command line?',
    difficulty : 2
});

models.question.create({
    question_text : 'How you contribute to the open source community (Github, Bitbucket, IRC, forums)?',
    difficulty : 1
});


/* USERS */
models.user.create({
    username: 'byrdman419',
    first_name: 'Ben',
    last_name: 'Byrd',
    pw_hash: 'geocent'
});

models.user.create({
    username: 'jackalope',
    first_name: 'Jack',
    last_name: 'Meagher',
    pw_hash: 'geocent'
});

models.user.create({
    username: 'nickd',
    first_name: 'nick',
    last_name: 'desisto',
    pw_hash: 'geocent'
});

models.user.create({
    username: 'pony555',
    first_name: 'James',
    last_name: 'Shockley',
    pw_hash: 'geocent'
});

models.user.create({
    username: 'BigBoss123',
    first_name: 'Sebastian',
    last_name: 'Van Delden',
    pw_hash: 'geocent'
});

//
//models.interviewQuestion.create({
//    interviewId : 3,
//    questionId : 41
//});

