var flightInterval;
var _ = require('lodash');

module.exports = {

    launchAll: function(done) {

        City.find({country: 'usa'}, function(err, cities){
            if (err) return done(err);
            var cityIds = _.pluck(cities, 'id');
            Icbm.find({status: "dormant"}, function(err, icbms){
                if (err) return done(err);
                async.each(icbms, function(icbm, next){
                    var target = cityIds.pop();
                    Icbm.launch(icbm.id, target, function(err, icbm){
                        if (err) return next(err);
                        var payload = _.merge(icbm, { eventType: 'launch' })
                        Icbm.publishUpdate(icbm.id, payload)
                        next(null, icbm);
                    })
                }, function(err, rslt){
                    if (err) return done(err);
                    flightInterval = setInterval(advanceInFlight, 250);
                    done(null, rslt);
                })
            })
        })

    },

    stopAll: function(done) {
        clearInterval(flightInterval);
        Icbm.update({}, {status: 'neutralized'}, done);
    }
}

function advanceInFlight(done) {
    Icbm.find({status: 'inflight'}, function(err, icbms){
        if (err) return done(err);
        async.each(icbms, function(icbm, next){
            Icbm.advance(icbm.id, function(err, icbm) {
                if (err) return next(err);
                var eventType = (icbm.status === 'impacted') ? 'impact' : 'advance';
                var payload = _.merge(icbm, {eventType: eventType});
                Icbm.publishUpdate(icbm.id, payload)
                next(null, icbm);
            });
        }, done);
    })
}
