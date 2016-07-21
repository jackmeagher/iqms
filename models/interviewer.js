"use strict";

module.exports = function(sequelize, DataTypes) {
    var interviewer = sequelize.define("interviewer", {
            name: DataTypes.STRING
        },
        {
            classMethods: {
                associate: function(models) {
                    interviewer.belongsToMany(models.tag, {through : "interviewerTag", as: "Tags"});
                    interviewer.belongsToMany(models.question, {through: "interviewerQuestion", as: "Questions"});
                  //  interviewer.belongsToMany(models.user, {through: "interviewerUser", as: "user"});
                    
                   // interviewer.belongsToMany(models.interview, {through: models.interview});
                   interviewer.hasOne(models.interview);
                }
            }
        });

    return interviewer;
};