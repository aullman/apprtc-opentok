var opentok = require('opentok');

var OPENTOK_API_KEY = "33439352";
var OPENTOK_API_SECRET = "358115ac4c092a604d3ef2fd615d5b6fb3f5a2e0";

var ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET);

exports.index = function(req, res) {
    var renderIndex = function renderIndex(sessionId) {
        var token = ot.generateToken({
          'role': "publisher"
        });

        res.render('index', {
            apiKey: OPENTOK_API_KEY,
            sessionId: sessionId,
            token: token,
            host: req.headers.host
        });
    };
    
    var sessionId = req.param("s", "");
    sessionId ? renderIndex(sessionId) : ot.createSession('', {}, renderIndex);
};