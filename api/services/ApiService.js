module.exports = {
    
    response: function(req, res, err, data) {

        if (err)   return res.negotiate(err);
        if (!data) return res.notFound();

        return res.json(data);
    }
}
