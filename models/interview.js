"use strict";

module.exports = function(sequelize, DataTypes) {
    var interview = sequelize.define("interview", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        },

        {
        classMethods: {
            associate: function(models) {
                //interview.hasOne(models.candidatePosition);
                //interview.hasOne(models.interviewer);
            }
        }
    });

    return interview;
};
