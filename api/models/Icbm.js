var arc = require('arc');

module.exports = {


    attributes: {

        origin: {
            model: 'city',
            required: true
        },

        target: {
            model: 'city'
        },

        status: {
            type: 'string',
            in: ['dormant', 'inflight', 'impacted', 'neutralized'],
            required: true,
            defaultsTo: 'dormant'
        },

        trajectory: {
            type: 'array'
        },

        trajectoryPoint: {
            type: 'integer'
        },

        currentLocation: function() {
            if (!this.trajectory) return false;
            return this.trajectory[this.trajectoryPoint];
        }

    },

    launch: function(id, target, done) {
        async.waterfall([
            function(next) {
                Icbm.findOne(id, next)
            },
            function(icbm, next) {
                if (icbm.status != 'dormant') {
                    return next({ message: "Icbm " + id + " has already been launched" })
                }

                Icbm.update({id: id}, {
                    target: target,
                    status: 'inflight'
                }, next)
            },
            function(icbms, next) {
                Icbm.findOne(id)
                .populate('origin')
                .populate('target')
                .exec(next)
            },
            function(icbm, next) {
                var dist = calculatePythag(icbm.origin, icbm.target);
                dist = parseInt(dist);

                var generator = new arc.GreatCircle({
                    x: icbm.origin.lon,
                    y: icbm.origin.lat
                }, {
                    x: icbm.target.lon,
                    y: icbm.target.lat
                });
                var trajectory = generator.Arc(dist);
                Icbm.update(icbm.id, {
                    trajectory: trajectory.geometries[0].coords,
                    trajectoryPoint: 0
                }, next);
            },

            function(updated, next) {
                Icbm.findOne(updated[0].id)
                .populate('origin')
                .populate('target')
                .exec(next);
            }
        ], done);
    },

    advance: function(id, done) {

        Icbm.findOne(id, function(err, icbm) {
            if (err) return done(err);

            if (icbm.status != 'inflight') {
                return done({ message: "Icbm " + id + " is not in flight" });
            }

            var params = {
                trajectoryPoint: icbm.trajectoryPoint + 1
            }

            if (params.trajectoryPoint >= icbm.trajectory.length - 1) {
                params.status = 'impacted';
            }

            Icbm.update({id: icbm.id}, params, function(err, icbms){
                done(err, icbms[0]);
            })
        })
    }
}


function calculatePythag(start, end) {
    var x = start.lon - end.lon;
    var y = start.lat - end.lat;

    return Math.sqrt( (x*x) + (y*y) )
}
