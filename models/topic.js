"use strict";

module.exports = function(sequelize, DataTypes) {
    var topic = sequelize.define("topic", {
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        index: DataTypes.INTEGER,
        sub: DataTypes.ARRAY(DataTypes.STRING)
    }, {
        classMethods: {}  
    });
    
    return topic;
};