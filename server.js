var Spire = require('spire.io.js');
var express = require('express');

if (!process.env.SPIRE_KEY){
  console.log("You must set a SPIRE_KEY environment variable");
  process.exit(1);
}

var spire = new Spire({key: process.env.SPIRE_KEY});

var app = express.createServer(
  express.static(__dirname + '/public')
);

app.get(
  '/discover',
  function(req, res){
    var description = {
      channel: clientPublishableChannel,
      subscription: clientSubscription
    };

    res.contentType('application/json');
    res.send(JSON.stringify(description));
  }
);

var clientSubscription;
var clientPublishableChannel;

var createAndAssign = function(){
  spire.requests.channels.create(
    {name: 'client-publishable-channel'},
    function(err, channel){
      clientPublishableChannel = channel;
    }
  );

  spire.requests.channels.create(
    {name: 'client-subscribable-channel'},
    function(err, channel){
      spire.requests.subscriptions.create(
        {
          channels: [channel],
          events: ['messages']
        },
        function(err, subscription){
          clientSubscription = subscription;
        }
      );
    }
  );
}
spire.connect(createAndAssign);

spire.messages.subscribe(
  'client-publishable-channel',
  function(err, messages){
    for (i=0;i<messages.length;i++){
      var content = messages[i].content;
      var tnetnoc = content.split('').reverse().join('');
      spire.messages.publish({channel:'client-subscribable-channel', content:tnetnoc});
    }
  }
);

var doit = function(){
  if (clientPublishableChannel && clientSubscription){
    console.log('discovery success! starting server...');
    app.listen(3000);
  } else {
    console.log('waiting for discovery...');
    setTimeout(doit, 500);
  }
}

doit();