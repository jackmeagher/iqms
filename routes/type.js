var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('type', '/type', {
   get: (req, res) => {
    var query_doc = {};
    
    if (req.query.label) {
        query_doc.label = req.query.label;
    }
    
    models.type.findAll({where: query_doc}).
      then(function(types) {
         res.status(200).json({types: types});
      })
   },
   post: (req, res) => {
      if(!req.query.label) {
         req.query.label = 'Blank';
      }
      
      models.type.create({
         label: req.body.label ? req.body.label : null
      }).then(function(created) {
         res.status(201).json({type: created.dataValues});
      })
   },
});