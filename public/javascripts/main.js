TB.setLogLevel(TB.DEBUG);

var $ = function() {
    return document.querySelector.apply(document, arguments);
};

var $bottomBar = $("#bottomBar"),
    $subscribers = $("#subscribers"),
    $publisher = $("#publisher");

TB.initLayoutContainer($subscribers);

TB.on("exception", function(event) {
    if(event.code === 1007) {
        $bottomBar.className = "full";
    }
});

var session = TB.initSession(sessionId),
    connected = false;

var publisher = TB.initPublisher(apiKey, "publisher", {
    width: "100%",
    height: "100%"
}).on("accessAllowed", function() {
    $bottomBar.className = "joinLink";
    OT.$.addClass($publisher, "visible");
});

var subscribeToStreams = function(streams) {
    for (var i=0; i < streams.length; i++) {
        var stream = streams[i];
        if (stream.connection.connectionId === session.connection.connectionId) continue;
        if (!connected) {
            OT.$.addClass($("#chat"), "connected");
            connected = true;
        }
        var div = document.createElement("div");
            
        div.setAttribute("id", stream.streamId);
        $subscribers.appendChild(div);
        session.subscribe(stream, stream.streamId);
    }
};

session.on({
    sessionConnected: function(event){
        subscribeToStreams(event.streams);
        session.publish(publisher);
    },
    streamCreated: function(event){
        subscribeToStreams(event.streams);
    }
}).connect(apiKey, token);