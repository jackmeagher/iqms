"use strict";

module.exports = function(sequelize, DataTypes) {
    var Interview = sequelize.define("Interview", {
        id: {
            type : DataTypes.UUID,
            field: 'id',
            primaryKey: true

        }


    }, {
        classMethods: {

        }
    });


    //Interview.hasMany(Question,{as  : 'Questions'});

    return Interview;
};

