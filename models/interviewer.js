"use strict";

module.exports = function(sequelize, DataTypes) {
    var interviewer = sequelize.define("interviewer", {
            name: DataTypes.STRING
        },
        {
            classMethods: {
                associate: function(models) {
                
                }
            }
        });

    return interviewer;
};