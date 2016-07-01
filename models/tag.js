"use strict";

module.exports = function(sequelize, DataTypes) {
    var tag = sequelize.define("tag", {
            name: DataTypes.STRING,
            type: DataTypes.STRING
        },

        {
            classMethods: {
                associate: function(models) {
                    tag.belongsToMany(models.question, {through : "questionTag", as : "Questions"});
                }
            }
        });

    return tag;
};

