"use strict";

module.exports = function(sequelize, DataTypes) {
    var interview = sequelize.define("interview", {
            interviewee: DataTypes.STRING,
            interview: DataTypes.STRING
        },

        {
        classMethods: {
            associate: function(models) {
                interview.hasMany(models.question);



            }

        }
    });



    return interview;
};

