var opentok = require('opentok');

module.exports = function(config) {
    var apiKey = config.apiKey,
        ot = new opentok.OpenTokSDK(config.apiKey, config.apiSecret);

    return {
        index: function(req, res) {    
            ot.createSession('', {}, function(sessionId) {
                res.redirect('/s/' + sessionId);
            });
        },

        session: function(req, res) {
            var p_apiKey = req.param("apiKey") || apiKey,
                sessionId = req.params.sessionId,
                token = req.param("token") || 
                        ot.generateToken({sessionId: sessionId,role: "publisher"});

            res.render('index', {
                apiKey: p_apiKey,
                sessionId: sessionId,
                token: token,
                link: "http://" + req.headers.host + "/s/" + sessionId
            });
        }
    };
};