"use strict";

module.exports = function(sequelize, DataTypes) {
    var role = sequelize.define("role", {
            type : DataTypes.STRING,
            // TODO: figure out what val means what role

        }


        , {
            classMethods: {
                associate: function(models) {
//                    role.belongsToMany(models.user, {through: 'userRole', as: 'Users', onDelete : 'SET NULL', onUpdate : 'CASCADE' });

                }
            }
        });

    return role;
};