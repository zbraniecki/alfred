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
  const d = new Date();
  return db.collection('updates').insert({
    author,
    channel,
    status: 'inbox',
    resolved: false,
    text,
    createdAt: d,
    firstCreatedAt: d,
  });
}

const createDateRe = /create a report for ([0-9]{4}-[0-9]{2}-[0-9]{2})/;

function pad(str) {
  return ('00'+str).slice(-2);
}

function createReport(db, text) {
  const result = createDateRe.exec(text);
  const reportDate = new Date(result[1]);
  const year = reportDate.getUTCFullYear();
  const month = reportDate.getUTCMonth() + 1;
  const day = reportDate.getUTCDate();
  const slug = `${year}-${pad(month)}-${pad(day)}`;
  return db.collection('reports').insert({
    slug,
    reportDate
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

    if (text.startsWith('create a report for')) {
      return createReport(db, text).then(
        () => client.say(channel, `${author}: report created.`)
      );
    }

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
