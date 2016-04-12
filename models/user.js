"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        // TODO: figure out what val means what role
        username: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        pw_hash: DataTypes.STRING,
        salt: DataTypes.STRING

    }


    , {
        classMethods: {
            associate: function(models) {
                user.belongsToMany(models.interview, {through: "interviewOwner", as: "OwnedInterviews"});
                user.belongsToMany(models.interview, {through: "interviewee", as: "ReceivingInterviews"});
                user.belongsToMany(models.role, {through: "userRole", as: "Roles"});
            }
        }
    });

    return user;
};