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

function saveUpdate(db, author, channel, text) {
  return db.collection('updates').insert({
    author,
    channel,
    status: 'inbox',
    resolved: false,
    text,
    createdAt: new Date()
  });
}

export function createBot(url, name, db) {
  const client = new Client(url, name);

  client.addListener('invite', function(channel) {
    console.log(` --- got an invite to ${channel}`);

    client.join(channel, () => client.say(channel, 'hello'));
  });

  // listen to messages in public channels
  client.addListener('message#', function(author, channel, message) {
    console.log(` --- got a message from ${author} in ${channel}: ${message}`);

    if (message.indexOf(`${name}: `) !== 0) {
      // the message wasn't directed at the bot
      return;
    }

    const text = message.slice(name.length + 2);

    saveUpdate(db, author, channel, text).then(
      () => client.say(channel, `${author}: ${randElem(CONFIRMATIONS)}`)
    );
  });

  // listen to private messages
  client.addListener('pm', function(author, message) {
    console.log(` --- got a private message from ${author}: ${message}`);

    // private messages are saved with channel = author
    saveUpdate(db, author, author, message).then(
      () => client.say(author, `${randElem(CONFIRMATIONS)}`)
    );
  });
}
