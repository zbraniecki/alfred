import { Client } from  'irc';

const CONFIRMATION_MESSAGES = [
  'naturally',
  'of course',
  'splendid',
  'jolly good',
  'noted',
  'point taken',
  'at your service',
  'sounds good'
];

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function saveUpdate(db, author, channel, text) {
  const d = new Date();
  return db.collection('updates').insert({
    author,
    channel,
    status: 'inbox',
    resolved: false,
    text,
    createdAt: d,
    firstCreatedAt: d,
  }).then(
    () => randElem(CONFIRMATION_MESSAGES),
    () => randElem(ERROR_MESSAGES)
  );
}

const createDateRe = /create a report for ([0-9]{4}-[0-9]{2}-[0-9]{2})/;

function createReport(db, text) {
  const [, slug] = createDateRe.exec(text);
  return db.collection('reports').insert({
    slug,
    reportDate: new Date(slug)
  }).then(
    () => 'report created',
    () => randElem(ERROR_MESSAGES)
  );
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
    parseCommand(db, author, channel, text).then(
      response => client.say(channel, `${author}: ${response}`)
    );
  });

  // listen to private messages
  client.addListener('pm', function(author, message) {
    console.log(` --- got a private message from ${author}: ${message}`);

    // private messages are saved with channel = author
    parseCommand(db, author, author, message).then(
      response => client.say(author, response)
    );
  });
}

function parseCommand(db, author, channel, message) {
  if (message.startsWith('create a report for')) {
    return createReport(db, message);
  }

  return saveUpdate(db, author, channel, message);
}
