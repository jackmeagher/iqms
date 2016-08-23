"use strict";

module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        text: DataTypes.STRING,
        difficulty: DataTypes.INTEGER,
        answers: DataTypes.ARRAY(DataTypes.STRING)
    }, {
        classMethods: {
            associate: function(models) {
                question.belongsToMany(models.tag, {through : "questionTag", as: "Tags"});
                question.belongsToMany(models.interview, {through: models.interviewQuestion});
            }
        }
    });
    
    return question;
};

