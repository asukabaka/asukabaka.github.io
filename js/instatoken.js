$(document).ready(function() {
  var feed = new Instafeed({
    accessToken: InstagramToken
  });
  feed.run();
});