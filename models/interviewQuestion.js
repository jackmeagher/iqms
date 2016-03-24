/**
 * Created by nick on 3/17/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var interviewQuestion = sequelize.define("interviewQuestion", {

        },

        {
            classMethods: {
                associate: function(models) {

                }

            }
        });



    return interviewQuestion;
};