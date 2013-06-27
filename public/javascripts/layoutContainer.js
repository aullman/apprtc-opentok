/**
 *  layout-container (http://github.com/opentok/layout-container)
 *  
 *  Automatic layout of video elements (publisher and subscriber) minimising white-space for the OpenTok on WebRTC API.
 *
 *  @Author: Adam Ullman (http://github.com/aullman)
**/

(function() {
    var observeChildChange = function observeChildChange(element, onChange) {
        observer = new MutationObserver(function(mutations) {
            var removedNodes = [];
            var addedNodes = [];

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    addedNodes = addedNodes.concat(Array.prototype.slice.call(mutation.addedNodes));                        
                }
                if (mutation.removedNodes.length) {
                    removedNodes = removedNodes.concat(Array.prototype.slice.call(mutation.removedNodes));
                }
            });

            if (addedNodes.length || removedNodes.length) {
                OT.$.callAsync(function() {
                    onChange(addedNodes, removedNodes);
                });
            }
        });

        observer.observe(element, {
            attributes:false,
            childList:true,
            characterData:false,
            subtree:false
        });

        return observer;
    };
    
    var positionElement = function positionElement(elem, x, y, width, height) {
        var targetPosition = {
            left: x + "px",
            top: y + "px",
            width: width + "px",
            height: height + "px"
        };
        OT.$.css(elem, targetPosition);
        
        var sub = elem.querySelector(".OT_root");
        if (sub) {
            // If this is the parent of a subscriber or publisher then we need
            // to force the mutation observer on the publisher or subscriber to
            // trigger to get it to fix it's layout
            var oldWidth = sub.style.width;
            sub.style.width = width + "px";
            // sub.style.height = height + "px";
            sub.style.width = oldWidth || "";
        }
    };
    
    var layout = function layout(container) {
        if (OT.$.css(container, "display") === "none") {
            return;
        }
        
        var count = container.children.length,
            Height = parseInt(OT.$.height(container), 10)  - 
                        (parseInt(OT.$.css(container, "borderTop"), 10) || 0) - 
                        (parseInt(OT.$.css(container, "borderBottom"), 10) || 0),
            Width = parseInt(OT.$.width(container), 10) -
                        (parseInt(OT.$.css(container, "borderLeft"), 10) || 0) -
                        (parseInt(OT.$.css(container, "borderRight"), 10) || 0),
            availableRatio = Height / Width,
            vidRatio;
        
        var tryVidRatio = function tryVidRatio(vidRatio) {
            var minDiff,
                targetCols,
                targetRows;
            for (var i=1; i <= count; i++) {
                var cols = i;
                var rows = Math.ceil(count / cols);
                var ratio = rows/cols * vidRatio;
                var ratio_diff = Math.abs(availableRatio - ratio);
                if (minDiff == undefined || (ratio_diff < minDiff)) {
                    minDiff = ratio_diff;
                    targetCols = cols;
                    targetRows = rows;
                }
            };
            return {
                minDiff: minDiff,
                targetCols: targetCols,
                targetRows: targetRows,
                ratio: vidRatio
            };
        };
        
        // Try all video ratios between 4x3 (landscape) and 2x3 (portrait)
        // Just a brute force approach to figuring out the best ratio
        var incr = 75/2000,
            max = 3/2,
            testRatio,
            i;
        for (i=3/4; i <= max; i=OT.$.roundFloat(i+incr, 5)) {
            testRatio = tryVidRatio(i);
            if (!vidRatio || testRatio.minDiff < vidRatio.minDiff) vidRatio = testRatio;
        }

        if ((vidRatio.targetRows/vidRatio.targetCols) * vidRatio.ratio > availableRatio) {
            targetHeight = Math.floor( Height/vidRatio.targetRows );
            targetWidth = Math.floor( targetHeight/vidRatio.ratio );
        } else {
            targetWidth = Math.floor( Width/vidRatio.targetCols );
            targetHeight = Math.floor( targetWidth*vidRatio.ratio );
        }

        var spacesInLastRow = (vidRatio.targetRows * vidRatio.targetCols) - count,
            lastRowMargin = (spacesInLastRow * targetWidth / 2),
            lastRowIndex = (vidRatio.targetRows - 1) * vidRatio.targetCols,
            firstRowMarginTop = ((Height - (vidRatio.targetRows * targetHeight)) / 2),
            firstColMarginLeft = ((Width - (vidRatio.targetCols * targetWidth)) / 2);

        // Loop through each stream in the container and place it inside
        var x = 0,
            y = 0;
        for (i=0; i < container.children.length; i++) {
            var elem = container.children[i];
            if (i % vidRatio.targetCols == 0) {
                // We are the first element of the row
                x = firstColMarginLeft;
                if (i == lastRowIndex) x += lastRowMargin;
                y += i == 0 ? firstRowMarginTop : targetHeight;
            } else {
                x += targetWidth;
            }

            OT.$.css(elem, "position", "absolute");
            var actualWidth = targetWidth - parseInt(OT.$.css(elem, "paddingLeft"), 10) -
                            parseInt(OT.$.css(elem, "paddingRight"), 10) -
                            parseInt(OT.$.css(elem, "marginLeft"), 10) - 
                            parseInt(OT.$.css(elem, "marginRight"), 10);

             var actualHeight = targetHeight - parseInt(OT.$.css(elem, "paddingTop"), 10) -
                            parseInt(OT.$.css(elem, "paddingBottom"), 10) -
                            parseInt(OT.$.css(elem, "marginTop"), 10) - 
                            parseInt(OT.$.css(elem, "marginBottom"), 10);

            positionElement(elem, x, y, actualWidth, actualHeight);
        }
     };
     
     if (!TB) {
         throw new Error("You must include the OpenTok for WebRTC JS API before the layout-container library");
     }
     TB.initLayoutContainer = function(container) {
        container = typeof(container) == "string" ? OT.$(container) : container;
        
        OT.onLoad(function() {
            observeChildChange(container, function() {
                layout(container);
            });
            OT.$.observeStyleChanges(container, ['width', 'height'], function() {
                layout(container);
            });
            layout(container);
        });
    };
})();