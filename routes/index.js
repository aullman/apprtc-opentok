var opentok = require('opentok');

var OPENTOK_API_KEY = "33439352";
var OPENTOK_API_SECRET = "358115ac4c092a604d3ef2fd615d5b6fb3f5a2e0";

var ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET);

exports.index = function(req, res) {
    ot.createSession('', {}, function(sessionId) {
        res.redirect('/s/' + sessionId);
    });
};

exports.session = function(req, res) {
    var sessionId = req.params.sessionId;
    
    var token = ot.generateToken({
        sessionId: sessionId,
        role: "publisher"
    });

    res.render('index', {
        apiKey: OPENTOK_API_KEY,
        sessionId: sessionId,
        token: token,
        link: "http://" + req.headers.host + "/s/" + sessionId
    });
};