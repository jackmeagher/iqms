"use strict";

module.exports = function(sequelize, DataTypes) {
    var tag = sequelize.define("tag", {
            name: {type: DataTypes.STRING, primaryKey: true}
        },

        {
            classMethods: {
                associate: function(models) {
                    tag.belongsToMany(models.question, {through : "questionTag", as : "Questions"});
                    tag.belongsToMany(models.interview, {through: "interviewTag"});
                    tag.belongsToMany(models.position, {through: "interviewTag"});
                }
            }
        });

    return tag;
};
