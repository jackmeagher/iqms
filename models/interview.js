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
                interview.hasMany(models.user, {as : 'interviewOwners'});
            }

        }
    });



    return interview;
};

