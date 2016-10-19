import { Client } from  'irc';

import Commands from './commands';

function testCommand(bot, author, channel, message) {
  for (let command of bot.commands) {
    if (command.matches(message)) {
      return Promise.resolve(command.test(bot, author, channel, message));
    }
  }

  return Promise.resolve(null);
}

function parseCommand(bot, author, channel, message) {
  if (message.startsWith('test ')) {
    message = message.substr(5);
    return testCommand(bot, author, channel, message);
  }

  for (let command of bot.commands) {
    if (command.matches(message)) {
      return command.execute(bot, author, channel, message).catch(
        e => console.error(`Command ${command.name} failed with error "${e}"`));
    }
  }

  return Promise.resolve(null);
}

export class Bot {
  constructor(url, name, api_url) {
    this.url = url;
    this.name = name;
    this.api_url = api_url;
    this.commands = Commands;
    this.actionLog = new Map();
  }

  start() {
    this.client = new Client(this.url, this.name);

    this.client.addListener('invite', (channel) => {
      console.log(` --- got an invite to ${channel}`);

      this.client.join(channel, () => this.client.say(channel, 'hello'));
    });

    // listen to messages in public channels
    this.client.addListener('message#', (author, channel, message) => {
      console.log(` --- got a message from ${author} in ${channel}: ${message}`);

      if (!message.startsWith(`${this.client.nick}: `)) {
        // the message wasn't directed at the bot
        return;
      }

      const text = message.slice(this.client.nick.length + 2);
      parseCommand(this, author, channel, text).then(
        response => this.client.say(channel, `${author}: ${response}`)
      );
    });

    // listen to private messages
    this.client.addListener('pm', (author, message) => {
      console.log(` --- got a private message from ${author}: ${message}`);

      // private messages are saved with channel = author
      parseCommand(this, author, author, message).then(
        response => this.client.say(author, response)
      );
    });
  }

  getActionLog(user, channel) {
    const hash = `${user}-${channel}`;
    if (!this.actionLog.has(hash)) {
      return [];
    }
    return this.actionLog.get(hash);
  }

  logAction(user, channel, action) {
    const ts = Date.now();
    const hash = `${user}-${channel}`;
    if (!this.actionLog.has(hash)) {
      this.actionLog.set(hash, []);
    }
    const log = this.getActionLog(user, channel);
    if (log.length > 10) {
      log.shift();
    }
    log.push({
      ts,
      object: action
    });
  }
}
