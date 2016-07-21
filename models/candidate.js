"use strict";

module.exports = function(sequelize, DataTypes) {
    var candidate = sequelize.define("candidate", {
            name: DataTypes.STRING
        },
        {
            classMethods: {
                associate: function(models) {
                    candidate.belongsToMany(models.position, {through: models.candidatePosition});
                }
            }
        });

    return candidate;
};