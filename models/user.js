"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        // TODO: figure out what val means what role
        username: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,

    }


    , {
        classMethods: {
            associate: function(models) {
            }
        }
    });

    return user;
};