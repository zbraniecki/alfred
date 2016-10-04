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


function createReport(db, ts) {
  return db.collection('reports').insert({
    slug,
    reportDate: new Date(ts)
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

    if (!message.startsWith(`${client.nick}: `)) {
      // the message wasn't directed at the bot
      return;
    }

    const text = message.slice(client.nick.length + 2);
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

const createDateRe = /create a report for ([0-9]{4}-[0-9]{2}-[0-9]{2})/;

function parseCommand(db, author, channel, message) {
  let test = false;

  const command = {
    type: null,
  };

  if (message.startWith('test')) {
    test = true;
    message = message.substr(4);
  }

  if (message.startsWith('create a report for')) {
    const [, slug] = createDateRe.exec(message);
    const ts = Date.parse(slug);

    if (isNaN(ts)) {
      return Promise.reject('that\'s not a valid date');
    }
    command.type = 'create-report';
    command.ts = ts;
  } else if (message.startsWith(`i've done`) ||
             message.startsWith(`i've completed`)) {
    return ;
  } else if (message.startsWith('i need to') ||
             message.startsWith('i should')) {

  } else if (message.startsWith('next week')) {

  } else if (message.startsWith('scratch that') ||
             message.startsWith('remove last command')) {
  } else {
    command.type = 'update';
    command.text = message;
  }

  if (test) {
    return reportTest(command);
  }
  return executeCommand(db, command);
}

function reportTest(command) {
  switch (command.type) {
    case 'create-report':
      return `The command will create a report for ${command.ts}`
    case 'update':
      return `The command will insert a new inbox item
      for author "${command.author}" from channel "${command.channel}" with message "${command.text}"`;
  }
}

function executeCommand(db, command) {
  switch(command.type) {
    case 'update':
      return saveUpdate(db, command.author, command.channel, command.text);
    case 'create-report':
      return createReport(db, command.ts);
  }
}
