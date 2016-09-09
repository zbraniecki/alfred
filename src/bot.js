import { Client } from  'irc';

const BUTLER = 'alfred';
const CONFIRMATIONS = [
  'naturally',
  'of course',
  'splendid',
  'jolly good'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createBot(db) {
  const client = new Client('irc.mozilla.org', BUTLER, {
    channels: ['#alfred'],
  });

  client.addListener('message', function (author, channel, message) {
    console.log(author + ' => ' + channel + ': ' + message);

    if (!message.startsWith(`${BUTLER}: `)) {
      return;
    }

    db.collection('updates').insert({
      author,
      channel,
      text: message.slice(BUTLER.length + 2),
      createdAt: new Date()
    }).then(
      () => client.say(channel, `${author}: ${randElem(CONFIRMATIONS)}`)
    );
  });

  client.addListener('pm', function (author, message) {
    console.log(author + ' => (pm) ' + message);

    db.collection('updates').insert({
      author,
      channel: author,
      text: message,
      createdAt: new Date()
    }).then(
      () => client.say(author, `${randElem(CONFIRMATIONS)}`)
    );
  });
}
