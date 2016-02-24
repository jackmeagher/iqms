"use strict";

module.exports = function(sequelize, DataTypes) {
    var Answer = sequelize.define("Answer", { // this defines the table name


        feedback : DataTypes.STRING,
        rating : DataTypes.INTEGER // needs to be 1-5 (stars)


    }, {
        classMethods: {
            associate: function(models) {
                Answer.hasOne(models.Interview, {as: 'Interview'});
                Answer.hasOne(models.Question, {as: 'Question'});
            }


        }

    });


// interview : interview
// question : question
    return Answer;
};