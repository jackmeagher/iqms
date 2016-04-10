/**
 * Created by nick on 4/10/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var position = sequelize.define("position", {
            title: DataTypes.STRING,
        },

        {
            classMethods: {
                associate: function(models) {
                    position.belongsToMany(models.interview, {through : "interviewPosition", as : "Interviews"});
                }
            }
        });

    return position;
};

