"use strict";

module.exports = function(sequelize, DataTypes) {
    var InterviewQuestionReceipt = sequelize.define("InterviewQuestionRecipt", { // this defines the table name
        id: {
            type : DataTypes.UUID,
            field: 'id',
            primaryKey: true
        },

        feedback : DataTypes.STRING,
        rating : DataTypes.INTEGER // needs to be 1-5 (stars)


    }, {
        classMethods: {
         //   InterviewQuestionReceipt.hasOne(Interview, {as: 'Interview'});
         //   InterviewQuestionReceipt.hasOne(Question, {as: 'Question'});

}

    });


// interview : interview
// question : question
    return InterviewQuestionReceipt;
};