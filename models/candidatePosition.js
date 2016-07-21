"use strict";

module.exports = function(sequelize, DataTypes) {
    var candidatePosition = sequelize.define("candidatePosition", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        },

        {
            classMethods: {

            }
        });

    return candidatePosition;
};

