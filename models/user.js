"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        // TODO: figure out what val means what role
        username: DataTypes.STRING,
        first_name:{
            type: DataTypes.STRING,
            validate :{
                isAlpha : true
            }
        },
        last_name :{
                type: DataTypes.STRING,
                validate :{
                    isAlpha : true
                }
            },
        email : {
            type : DataTypes.STRING,
            validate :{
                isEmail : true
            }
        }

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