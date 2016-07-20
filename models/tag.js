"use strict";

module.exports = function(sequelize, DataTypes) {
    var tag = sequelize.define("tag", {
            name: {type: DataTypes.STRING, primaryKey: true},
            count: DataTypes.INTEGER
        },

        {
            classMethods: {
                associate: function(models) {
                    tag.belongsToMany(models.question, {through : "questionTag", as : "Questions"});
                    tag.belongsToMany(models.interviewer, {through: "interviewerTag"});
                }
            }
        });

    return tag;
};

