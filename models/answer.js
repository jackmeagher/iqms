"use strict";

module.exports = function(sequelize, DataTypes) {
    var answer = sequelize.define("answer", { // this defines the table name

        feedback : DataTypes.STRING,
        rating : DataTypes.INTEGER, // needs to be 1-5 (stars)
        interview_id : DataTypes.INTEGER,
        question_id : DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                answer.belongsTo(models.interview);
                answer.belongsTo(models.question);
            }
        }

    });


// interview : interview
// question : question
    return answer;
};