"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {

            username: DataTypes.STRING,
            first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        pw_hash: DataTypes.STRING

    }


    , {
        classMethods: {
            associate: function(models) {
                user.hasMany(models.interview);
            }
        }
    });

    return user;
};