var _ = require('lodash');

module.exports = {

    getAll: function(req, res) {
        Icbm.find({}).populate('origin').exec(function(err, icbms){
            var icbmIds = _.pluck(icbms, 'id');
            if (req.isSocket) {
                Icbm.subscribe(req, icbmIds);
            }
            return ApiService.response(req, res, err, icbms);
        })
    },

    launchAll: function(req, res) {
        IcbmService.launchAll(function(err, icbms) {
            ApiService.response(req, res, err, {status: "launched"})
        })
    }
}
