import { Client } from  'irc';

const CONFIRMATIONS = [
  'naturally',
  'of course',
  'splendid',
  'jolly good',
  'noted',
  'point taken',
  'at your service',
  'sounds good'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createBot(url, name, db) {
  const client = new Client(url, name);

  client.addListener('invite', function(channel) {
    console.log(` --- got an invite to ${channel}`);

    client.join(channel, () => client.say(channel, 'hello'));
  });

  client.addListener('message', function(author, channel, message) {
    console.log(` --- got a message from ${author} in ${channel}: ${message}`);

    if (message.indexOf(`${name}: `) !== 0) {
      return;
    }

    db.collection('updates').insert({
      author,
      channel,
      status: 'inbox',
      resolved: false,
      text: message.slice(name.length + 2),
      createdAt: new Date()
    }).then(
      () => client.say(channel, `${author}: ${randElem(CONFIRMATIONS)}`)
    );
  });

  client.addListener('pm', function(author, message) {
    console.log(` --- got a private message from ${author}: ${message}`);

    db.collection('updates').insert({
      author,
      channel: author,
      status: 'inbox',
      resolved: false,
      text: message,
      createdAt: new Date()
    }).then(
      () => client.say(author, `${randElem(CONFIRMATIONS)}`)
    );
  });
}
