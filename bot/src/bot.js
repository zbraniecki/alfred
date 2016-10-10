import { Client } from  'irc';

import { Commands } from './commands/index';


function parseCommand(commands, api_url, author, channel, message) {
  let test = false;

  if (message.startsWith('test ')) {
    message = message.substr(5);
    test = true;
  }

  for (let command of commands) {
    if (command.matches(message)) {
      if (test) {
        return Promise.resolve(command.test(api_url, author, channel, message));
      }
      return command.execute(api_url, author, channel, message);
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
      parseCommand(this.commands, this.api_url, author, channel, text).then(
        response => this.client.say(channel, `${author}: ${response}`)
      );
    });

    // listen to private messages
    this.client.addListener('pm', (author, message) => {
      console.log(` --- got a private message from ${author}: ${message}`);

      // private messages are saved with channel = author
      parseCommand(this.commands, this.api_url, author, author, message).then(
        response => this.client.say(author, response)
      );
    });
  }
}
