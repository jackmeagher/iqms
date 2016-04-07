"use strict";

module.exports = function(sequelize, DataTypes) {
    var interview = sequelize.define("interview", {
            label: DataTypes.STRING,
            interviewee: DataTypes.STRING,
            interview: DataTypes.STRING
        },

        {
        classMethods: {
            associate: function(models) {
                interview.belongsToMany(models.user, {through: 'interviewOwner', as: 'Owners'});
                interview.belongsToMany(models.question, {through: 'interviewQuestion', as: 'Questions'});
            }
        }
    });



    return interview;
};
