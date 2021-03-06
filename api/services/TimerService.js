var util = require("util");
var EventEmitter = require('events').EventEmitter;
var _ = require("lodash");

var timeout;
var ttfi = 0;
var running = false;

function ImpactTimer() {
    var self = this;

    EventEmitter.call(self);

    self.runTimer = function() {
        self.getTimeToFirstImpact(function(err, ttfi){
            if (ttfi > 0) {
                timeout = setTimeout(function(){
                    ttfi--;
                    self.emit('tick', ttfi);
                    console.log("tick: " + ttfi)
                    self.runTimer();
                }, 1000)
                return true;
            } else {
                running = false;
                self.emit("boom");
                return false;
            }
        });
    }

}
util.inherits(ImpactTimer, EventEmitter);


ImpactTimer.prototype.getTimeToFirstImpact = function(done) {
    Icbm.find({status: 'impacted'}, function(err, impacted){
        if (impacted.length > 0) return done(err, 0);
        
        Icbm.find({status: 'inflight'}, function(err, inflight){
            var times = _.map(inflight, function(icbm){
                return icbm.trajectory.length - icbm.trajectoryPoint;
            })
            var maxTime = _.max(times);
            done(null, maxTime);
        })
    })
}

ImpactTimer.prototype.setTimeToFirstImpact = function(time) {
    ttfi = parseInt(time);
}

// shorter alias
ImpactTimer.prototype.setTTFI = ImpactTimer.prototype.setTimeToFirstImpact;

ImpactTimer.prototype.isRunning = function() {
    return running;
}

ImpactTimer.prototype.start = function() {

    if (running) {
        console.log('timer already running');
        return false;
    }

    running = true;
    var self = this;
    self.emit('start');
    return self.runTimer();
}

ImpactTimer.prototype.stop = function() {
    running = false;
    clearTimeout(timeout);
}


module.exports = new ImpactTimer();
