const irc = require('irc');
const client = new irc.Client('irc.mozilla.org', 'alfred', {
  channels: ['#alfred'],
});

client.addListener('message', function (name, channel, message) {
  console.log(name + ' => ' + channel + ': ' + message);

  if (message.startsWith('alfred: ')) {
    client.say(channel, `I'm listening, Master ${name}`);
  }
});

client.addListener('pm', function (from, message) {
  console.log(from + ' => ME: ' + message);
  //client.say('nonbeliever', "SRSLY, I AM!");
});
