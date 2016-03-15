"use strict";

module.exports = function(sequelize, DataTypes) {
    var userInterview = sequelize.define("userInterview", {
        role : DataTypes.STRING,
        userId : DataTypes.UUID,
        interviewId : DataTypes.UUID

    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });



    return userInterview    ;
};







