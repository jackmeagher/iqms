"use strict";

module.exports = function(sequelize, DataTypes) {
    var interview = sequelize.define("interview", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            conducted: DataTypes.BOOLEAN,
            recommendation: DataTypes.JSON,
            date: DataTypes.TEXT,
            location: DataTypes.TEXT,
            started: DataTypes.BOOLEAN
        },

        {
        classMethods: {
            associate: function(models) {
                interview.belongsToMany(models.question, {through: models.interviewQuestion});
                interview.belongsToMany(models.tag, {through: "interviewTag"});
                interview.belongsToMany(models.feedback, {through: "interviewFeedback"});
                interview.belongsToMany(models.user, {through: "interviewUser"});
            }
        }
    });

    return interview;
};
