var fs  = require('fs');
var yml = require("yaml-js");


module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var cwd = sails.config.cwd = process.cwd();
  fs.readFile(cwd + "/api/data/city.yml", function(err, buf){
      var cities = yml.load(buf.toString());
      async.each(cities, function(city, next){
          City.create(city, next);
      }, function(err) {
          if (err) throw err;

          fs.readFile(cwd + "/api/data/icbm.yml", function(err, buf){
              var icbms = yml.load(buf.toString());
              async.each(icbms, function(icbm, next){
                  Icbm.create(icbm, next);
              }, cb);
          })
      });
  })
};
