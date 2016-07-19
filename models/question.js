"use strict";

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        text: DataTypes.STRING,
        tech: DataTypes.BOOLEAN,
        difficulty: DataTypes.INTEGER,
        answers: DataTypes.ARRAY(DataTypes.STRING)
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

