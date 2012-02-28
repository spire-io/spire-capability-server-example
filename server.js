var Spire = require('spire.io.js');
var express = require('express');

if (!process.env.SPIRE_KEY){
  console.log("You must set a SPIRE_KEY environment variable");
  process.exit(1);
}

var spire = new Spire();
var clientSubscriptionData;
var clientPublishableChannelData;

spire.start(process.env.SPIRE_KEY, function(err, session) {
  spire.channel(
    'client-publishable-channel',
    function(err, channel){
      if (!err) {
        clientPublishableChannelData = {url: channel.data.url, capability: channel.data.capability};
      }
    }
  );

  spire.channel(
    'client-subscribable-channel',
    function(err, channel){
      channel.subscription(
        'clientReadOnlySubscription',
        function(err2, subscription){
          clientSubscriptionData = {url: subscription.data.url, capability: subscription.data.capability};
          spire.subscriptionFromUrlAndCapability(clientSubscriptionData, function(err, subscription) {
          });
        }
      );
    }
  );

  spire.subscribe(
    'client-publishable-channel',
    function(messages){
      for (var i=0;i<messages.length;i++){
        var content = messages[i].content;
        var tnetnoc = content.split('').reverse().join('');
        spire.publish('client-subscribable-channel', tnetnoc, function(){});
      }
    }
  );

});


var app = express.createServer(
  express.static(__dirname + '/public')
);

app.get(
  '/discover',
  function(req, res){
    var description = {
      channel: clientPublishableChannelData,
      subscription: clientSubscriptionData
    };
    res.contentType('application/json');
    res.send(JSON.stringify(description));
  }
);

var doit = function(){
  if (clientPublishableChannelData && clientSubscriptionData){
    console.log('discovery success! starting server...');
    app.listen(3000);
  } else {
    console.log('waiting for discovery...');
    setTimeout(doit, 500);
  }
}

doit();