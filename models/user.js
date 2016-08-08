"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        // TODO: figure out what val means what role
        name: {
            type: DataTypes.TEXT,
            primaryKey: true
        },
        role: DataTypes.TEXT

    }, {
        classMethods: {
            associate: function(models) {
                user.belongsToMany(models.interview, {through: "interviewUser"});
            }
        }
    });

    return user;
};
