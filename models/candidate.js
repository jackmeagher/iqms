"use strict";

module.exports = function(sequelize, DataTypes) {
    var candidate = sequelize.define("candidate", {
            name: DataTypes.STRING,
            url: DataTypes.STRING
        },

        {
            classMethods: { }
        });

    return candidate;
};