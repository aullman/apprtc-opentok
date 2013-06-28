apprtc-opentok
==============

OpenTok version of apprtc.appspot.com

AppRTC + OpenTok awesomeness including multiple participants! Invite up to 4 participants or even more if you're using [Mantis](http://www.tokbox.com/blog/mantis-next-generation-cloud-technology-for-webrtc/)!

The bulk of the code is in [main.js](public/javascripts/main.js). Then there is [layoutContainer.js](public/javascripts/layoutContainer.js) which handles laying out the multiple participants and [resize.js](public/javascripts/resize.js) which fixes the aspect ratio of things when resizing the window (neither of which apprtc do). At just 50 lines of client-side javascript code (as opposed to apprtc's main.js which is over 500 lines) it's much simpler to make an OpenTok app than a WebRTC app from scratch.

Have fun!

Setup
-----

To setup this app all you need is an OpenTok API Key and Secret. You can sign up for an OpenTok account [here](https://dashboard.tokbox.com/signups/new).

Then put them into the config.json.sample file and copy the config.json.sample file over to config.json.

Then do the usual node thing.
``
npm install
node app.js
``

Have fun!
