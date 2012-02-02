$(function(){
  var Spire = require('./spire.io.js');
  var spire = new Spire();
  var spireChannel;
  var spireSubscription;
  $.get('/discover', function(data){
    spireSubscription = data.subscription;
    spireChannel = data.channel;
    $('.loading').hide();
    $('.content').show();
    $('.submit.button').click(function(e){
      e.stopPropagation();
      e.preventDefault();
      spire.requests.messages.create({
        channel: spireChannel,
        content: $('.reverseme').text()
      });
    });
  });
});
