// Force resizing of elements so that layout works properly
// We're using mutation observers which only fire on explicit changes

var $pub = $("#publisher"),
    $sub = $("#subscribers"),
    resizeTimeout;

window.addEventListener("resize", function(event) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        var curWidth = $pub.style.width;
        $pub.style.width = "101%";
        $pub.style.width = curWidth;
        
        curWidth = $sub.style.width;
        $sub.style.width = "101%";
        $sub.style.width = "100%";
    }, 10);
});