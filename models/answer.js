"use strict";

module.exports = function(sequelize, DataTypes) {
    var answer = sequelize.define("answer", { // this defines the table name

        feedback : DataTypes.STRING,
        rating : DataTypes.INTEGER // needs to be 1-5 (stars)


    }, {
        classMethods: {
            associate: function(models) {
                answer.hasOne(models.interview);
                answer.hasOne(models.question);
                answer.hasOne(models.user); // user who submitted the answer
            }


        }

    });


// interview : interview
// question : question
    return answer;
};