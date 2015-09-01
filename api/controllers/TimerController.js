module.exports = {
    
    getTime: function(req, res) {
        ApiService.response(req, res, null, {
            timeToFirstImpact: TimerService.getTimeToFirstImpact()
        })
    }
}
