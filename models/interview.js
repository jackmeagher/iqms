"use strict";

module.exports = function(sequelize, DataTypes) {
    var Interview = sequelize.define("Interview", {


    },

        {
        classMethods: {
            associate: function(models) {
                Interview.hasMany(models.Question, {as: 'Questions'});

            }
            }
    });



    return Interview;
};

