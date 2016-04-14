"use strict";

module.exports = function(sequelize, DataTypes) {
    var interview = sequelize.define("interview", {
            label: DataTypes.STRING,
            interviewee: DataTypes.STRING
        },

        {
        classMethods: {
            associate: function(models) {
                interview.belongsTo(models.user, {as: 'interviewee'});
                interview.belongsToMany(models.user, {through: 'interviewOwner', as: 'Owners'});
                interview.belongsToMany(models.question, {through: 'interviewQuestion', as: 'Questions'});
                interview.hasMany(models.answer, {as : "Answers"});
            }
        }
    });



    return interview;
};
