



"use strict";

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        question_text: DataTypes.STRING,

        difficulty: DataTypes.INTEGER // E.G. junior = 0, intermediate = 1, senior = 2

    }, {
        classMethods: {
            associate: function(models) {

            }
        }
    });



    return question;
};







