var util = require("util")
var EventEmitter = require('events').EventEmitter;

var timeout;
var ttfi = 0;
var running = false;

function ImpactTimer() {
    var self = this;

    EventEmitter.call(self);

    self.runTimer = function() {
        if (ttfi > 0) {
            timeout = setTimeout(function(){
                ttfi--;
                self.emit('tick', ttfi);
                self.runTimer();
            }, 1000)
            return true;
        } else {
            running = false;
            self.emit("boom");
            return false;
        }

    }

}
util.inherits(ImpactTimer, EventEmitter);

    
ImpactTimer.prototype.getTimeToFirstImpact = function() {
    return ttfi;
}

ImpactTimer.prototype.setTimeToFirstImpact = function(time) {
    ttfi = parseInt(time);
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


module.exports = new ImpactTimer();
