"use strict";

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        question_text: DataTypes.STRING,
        sample_answer: DataTypes.STRING,
        difficulty: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                question.belongsToMany(models.interview, {through : "interviewQuestion", as: "Interviews"});
                question.belongsToMany(models.tag, {through : "questionTag", as: "Tags"});
            }
        }
    });

    return question;
};

