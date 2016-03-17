/**
 * Created by nick on 3/17/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var interviewQuestion = sequelize.define("interviewQuestion", {
            interview_id: {type : DataTypes.INTEGER, unique : true},
            question_id:  {type :DataTypes.INTEGER, unique : true}


        },

        {
            classMethods: {
                associate: function(models) {



                }

            }
        });



    return interviewQuestion;
};

