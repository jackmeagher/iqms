"use strict";

module.exports = function(sequelize, DataTypes) {
    var Question = sequelize.define("Question", {
        question_text: DataTypes.STRING,

        difficulty: DataTypes.INTEGER // E.G. junior = 0, intermediate = 1, senior = 2

    }, {
        classMethods: {
            associate: function(models) {

            }
        }
    });



    return Question;
};