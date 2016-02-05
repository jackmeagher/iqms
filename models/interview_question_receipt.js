"use strict";

module.exports = function(sequelize, DataTypes) {
    var InterviewQuestionReceipt = sequelize.define("InterviewQuestionReceipt", { // this defines the table name


        feedback : DataTypes.STRING,
        rating : DataTypes.INTEGER // needs to be 1-5 (stars)


    }, {
        classMethods: {
            associate: function(models) {
                InterviewQuestionReceipt.hasOne(models.Interview, {as: 'Interview'});
                InterviewQuestionReceipt.hasOne(models.Question, {as: 'Question'});
            }


        }

    });


// interview : interview
// question : question
    return InterviewQuestionReceipt;
};