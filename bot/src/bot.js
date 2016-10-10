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

function log(db, command) {
  const d = new Date();
  return db.collection('log').insert({
    author: command.author,
    channel: command.channel,
    command: command,
    timestamp: d
  });
}

function getLastCommand(db, author, channel) {
  return db.collection('log').find({
    author: author,
    channel: channel
  }).sort({
    timestamp: -1
  }).limit(1).toArray().then(res => {
    if (res.length > 0) {
      return res[0];
    }
    return null;
  });
}

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addInboxItem(db, author, channel, text) {
  const d = new Date();
  return db.collection('updates').insertOne({
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

function revertLastCommand(db, author, channel) {
  return getLastCommand(db, author, channel).then(lastCommand => {
    if (lastCommand === null) {
      return `No previous commands from user ${author} on channel ${channel}`;
    }
    let ts = lastCommand.timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit' 
    });
    let promise;
    switch (type) {
      case 'create-report':
        break;
      case 'add-inbox-item':
        promise = db.collection('inbox').
        break;
    }
    promise.then(() => {
      return db.collection('log').deleteOne({
        _id: lastCommand._id
      }).then(() => {
        return `Reverted command of type "${lastCommand.command.type}" from ${ts} with value ${JSON.stringify(lastCommand.command)}`;
      })
    });
  });
}


function createReport(db, ts) {
  let date = new Date(ts);
  let slug = createSlugFromDate(date);
  return db.collection('reports').insert({
    slug,
    reportDate: date
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
    author: author,
    channel: channel
  };

  if (message.startsWith('test ')) {
    test = true;
    message = message.substr(5);
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
    command.type = 'add-done-item';
  } else if (message.startsWith('i need to') ||
             message.startsWith('i should')) {
    command.type = 'add-current-item';
  } else if (message.startsWith('next week')) {
    command.type = 'add-next-week-item';
  } else if (message.startsWith('scratch that') ||
             message.startsWith('remove last command')) {
    command.type = 'revert-last-command';
  } else {
    command.type = 'add-inbox-item';
    command.text = message;
  }

  if (test) {
    return Promise.resolve(reportTest(db, command));
  }
  return executeCommand(db, command).then((msg) => {
    return log(db, command).then(() => {return msg;});
  });
}

function createSlugFromDate(date) {
  let nf = new Intl.NumberFormat('en-US', {
    minimumIntegerDigits: 2
  });
  let year = date.getUTCFullYear();
  let month = nf.format(date.getUTCMonth() + 1);
  let day = nf.format(date.getUTCDate());
  return `${year}-${month}-${day}`;
}

function reportTest(db, command) {
  switch (command.type) {
    case 'create-report':
      let slug = createSlugFromDate(new Date(command.ts));
      return `The command will create a report for ${slug}`;
    case 'add-inbox-item':
      return `The command will insert a new inbox item for author "${command.author}" from channel "${command.channel}" with message "${command.text}"`;
    case 'revert-last-command':
      return getLastCommand(db, command.author, command.channel).then(lastCommand => {
        if (lastCommand === null) {
          return `No previous commands from user ${command.author} on channel ${command.channel}`;
        }
        let ts = lastCommand.timestamp.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit' 
        });
        return `The command will revert command of type "${lastCommand.command.type}" from ${ts} with value ${JSON.stringify(lastCommand.command)}`;
      });
  }
}

function executeCommand(db, command) {
  switch(command.type) {
    case 'add-inbox-item':
      return addInboxItem(db, command.author, command.channel, command.text);
    case 'create-report':
      return createReport(db, command.ts);
    case 'revert-last-command':
  }
}
