"use strict";

module.exports = function(sequelize, DataTypes) {
    var interviewQuestion = sequelize.define("interviewQuestion", {
            state: DataTypes.ENUM('Blacklisted', 'Pinned')
        },

        {
            classMethods: {
                associate: function(models) {
                    
                }
            }
        });

    return interviewQuestion;
};

