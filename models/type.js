"use strict";

module.exports = function(sequelize, DataTypes) {
  var type = sequelize.define("type", {
    label: DataTypes.STRING
  }, {
    classMethods: {}
  });
  
  
  return type;  
};