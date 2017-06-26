/**
 * Created by nick on 4/10/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var position = sequelize.define("position", {
            name: DataTypes.STRING,
            description: DataTypes.TEXT
        },

        {
            classMethods: {
                associate: function(models) {
                    position.belongsToMany(models.candidate, {through: models.candidatePosition});
                    position.belongsToMany(models.tag, {through: "interviewTag"});
                }
            }
        });

    return position;
};
