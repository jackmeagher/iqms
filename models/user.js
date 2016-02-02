"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {
            type : DataTypes.UUID,
            field: 'id',
            primaryKey: true

        },
        username: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        pw_hash: DataTypes.STRING

    }, {
        classMethods: {
        }
    });

    return User;
};