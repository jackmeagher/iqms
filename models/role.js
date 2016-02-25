"use strict";

module.exports = function(sequelize, DataTypes) {
    var role = sequelize.define("role", {
            type : DataTypes.STRING,
            // TODO: figure out what val means what role

        }


        , {
            classMethods: {
                associate: function(models) {

                }
            }
        });

    return role;
};