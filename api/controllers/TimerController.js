
TimerService.on('tick', function(seconds) {
    sails.sockets.broadcast('ttfi', 'tick', {
        timeToFirstImpact: seconds
    });
})


module.exports = {

    getTime: function(req, res) {

        if (req.isSocket) {
            sails.sockets.join(req.socket, 'ttfi');
        }

        TimerService.getTimeToFirstImpact(function(err, ttfi){
            ApiService.response(req, res, null, {
                timeToFirstImpact: ttfi
            });
        })
    }
}
